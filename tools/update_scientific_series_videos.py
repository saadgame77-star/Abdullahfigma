from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

try:
    import yt_dlp
except ImportError as exc:
    raise SystemExit(
        "yt-dlp غير مثبت. نفّذ أولًا: python3 -m pip install --user yt-dlp"
    ) from exc


SERIES_FILE = Path("artifacts/sheikh-site/src/app/data/scientificSeries.ts")
REPORT_FILE = Path("tools/scientific-series-videos-report.json")


def format_duration(seconds: Any) -> str | None:
    if not isinstance(seconds, (int, float)):
        return None

    seconds = int(seconds)
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    remaining_seconds = seconds % 60

    if hours:
        return f"{hours}:{minutes:02d}:{remaining_seconds:02d}"

    return f"{minutes}:{remaining_seconds:02d}"


def get_playlist_videos(playlist_id: str) -> list[dict[str, Any]]:
    playlist_url = f"https://www.youtube.com/playlist?list={playlist_id}"

    options = {
        "quiet": True,
        "ignoreerrors": True,
        "extract_flat": "in_playlist",
        "skip_download": True,
    }

    with yt_dlp.YoutubeDL(options) as ydl:
        info = ydl.extract_info(playlist_url, download=False)

    entries = (info or {}).get("entries") or []
    videos: list[dict[str, Any]] = []

    for index, entry in enumerate(entries, start=1):
        if not entry:
            continue

        video_id = entry.get("id")
        title = entry.get("title") or f"الحلقة {index}"
        duration = (
            entry.get("duration_string")
            or format_duration(entry.get("duration"))
            or None
        )

        if not video_id:
            continue

        item: dict[str, Any] = {
            "id": index,
            "title": title,
            "videoId": video_id,
            "displayOrder": index,
        }

        if duration:
            item["duration"] = duration

        videos.append(item)

    return videos


def to_ts_videos(videos: list[dict[str, Any]], indent: str = "    ") -> str:
    if not videos:
        return "videos: [],"

    lines = ["videos: ["]
    for video in videos:
        lines.append(f"{indent}  {{")
        lines.append(f'{indent}    id: {video["id"]},')
        lines.append(
            f'{indent}    title: {json.dumps(video["title"], ensure_ascii=False)},'
        )
        lines.append(f'{indent}    videoId: "{video["videoId"]}",')

        if video.get("duration"):
            lines.append(f'{indent}    duration: "{video["duration"]}",')

        lines.append(f'{indent}    displayOrder: {video["displayOrder"]},')
        lines.append(f"{indent}  }},")
    lines.append(f"{indent}],")

    return "\n".join(lines)


def find_object_bounds(text: str, playlist_match_start: int) -> tuple[int, int]:
    start = text.rfind("{", 0, playlist_match_start)
    if start == -1:
        raise ValueError("لم أستطع تحديد بداية كائن السلسلة.")

    depth = 0
    in_string = False
    quote = ""
    escaped = False

    for index in range(start, len(text)):
        char = text[index]

        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                in_string = False
            continue

        if char in ("'", '"', "`"):
            in_string = True
            quote = char
            continue

        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                end = index + 1

                while end < len(text) and text[end] in (" ", "\n", "\r", "\t", ","):
                    if text[end] == ",":
                        end += 1
                        break
                    end += 1

                return start, end

    raise ValueError("لم أستطع تحديد نهاية كائن السلسلة.")


def replace_videos_in_object(object_text: str, videos: list[dict[str, Any]]) -> str:
    replacement = to_ts_videos(videos)

    videos_pattern = re.compile(
        r"videos:\s*\[(?:.|\n)*?\]\s*,",
        re.MULTILINE,
    )

    if videos_pattern.search(object_text):
        return videos_pattern.sub(replacement, object_text, count=1)

    insert_before = object_text.rfind("\n}")
    if insert_before == -1:
        return object_text

    return (
        object_text[:insert_before]
        + "\n    "
        + replacement
        + object_text[insert_before:]
    )


def main() -> None:
    if not SERIES_FILE.exists():
        raise SystemExit(f"لم أجد الملف: {SERIES_FILE}")

    text = SERIES_FILE.read_text(encoding="utf-8")

    backup_file = SERIES_FILE.with_suffix(".ts.bak-before-videos")
    backup_file.write_text(text, encoding="utf-8")

    playlist_ids = re.findall(r'playlistId:\s*"([^"]+)"', text)

    if not playlist_ids:
        raise SystemExit("لم أجد أي playlistId داخل الملف.")

    report: list[dict[str, Any]] = []
    updated_text = text

    for playlist_id in playlist_ids:
        print(f"جاري استخراج حلقات القائمة: {playlist_id}")

        try:
            videos = get_playlist_videos(playlist_id)
        except Exception as error:
            report.append(
                {
                    "playlistId": playlist_id,
                    "status": "failed",
                    "error": str(error),
                    "videoCount": 0,
                }
            )
            continue

        match = re.search(
            rf'playlistId:\s*"{re.escape(playlist_id)}"',
            updated_text,
        )

        if not match:
            report.append(
                {
                    "playlistId": playlist_id,
                    "status": "not_found_after_update",
                    "videoCount": len(videos),
                }
            )
            continue

        start, end = find_object_bounds(updated_text, match.start())
        object_text = updated_text[start:end]
        new_object_text = replace_videos_in_object(object_text, videos)

        updated_text = updated_text[:start] + new_object_text + updated_text[end:]

        report.append(
            {
                "playlistId": playlist_id,
                "status": "updated",
                "videoCount": len(videos),
                "videos": videos,
            }
        )

    SERIES_FILE.write_text(updated_text, encoding="utf-8")

    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    REPORT_FILE.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print("انتهى التحديث.")
    print(f"تم إنشاء نسخة احتياطية: {backup_file}")
    print(f"تقرير النتائج: {REPORT_FILE}")


if __name__ == "__main__":
    main()