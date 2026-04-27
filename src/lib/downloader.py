import json
import yt_dlp
import sys
import os

def my_progress_hook(d):
    if d['status'] == 'downloading':
        # Calculate percentage safely
        total = d.get('total_bytes') or d.get('total_bytes_estimate')
        if total:
            percent = (d['downloaded_bytes'] / total) * 100
            
            # For "My Melody", we want to send this back to Next.js
            # We print a JSON string that our Next.js API can read from stdout
            print(json.dumps({
                "status": "downloading",
                "percent": f"{percent:.1f}",
                "eta": d.get('eta'),
                "speed": d.get('speed')
            }))
            sys.stdout.flush() # Ensure it sends immediately

    elif d['status'] == 'error':
        # This sends the error back to your Next.js frontend
        print(json.dumps({
            "status": "error",
            "message": d.get('error', 'Unknown download error occurred'),
            "url": d.get('info_dict', {}).get('webpage_url')
        }))
        sys.stdout.flush()

    elif d['status'] == 'finished':
        print(json.dumps({"status": "finished", "filename": d['filename']}))
        sys.stdout.flush()

def download_audio(url, output_path="public/music"):
    # Ensure the output directory exists
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    ydl_opts = {
        'format': 'bestaudio/best',
        'progress_hooks': [my_progress_hook],
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }, {
            'key': 'FFmpegMetadata', # Injects artist/title info
        }, {
            'key': 'EmbedThumbnail',  # Adds album art to the file
        }],
        'writethumbnail': True,
        'outtmpl': f'{output_path}/%(title)s.%(ext)s',
        'quiet': False, # Set to True once you're done debugging
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("--- My Melody: CLI Test Mode ---")
    
    # Get the URL from the user
    target_url = input("Paste a YouTube (Music) URL: ").strip()
    
    if target_url:
        print(f"\nInitiating download for: {target_url}\n")
        download_audio(target_url)
        print("\n--- Process Finished ---")
    else:
        print("No URL entered. Exiting.")



# test url: https://music.youtube.com/watch?v=Mnl60DoIMk4&si=xwDtlgneDc0fvTFd
# test error url: https://music.youtube.com/watch?v=thisdoesntwork&si=xwDtlgneDc0f