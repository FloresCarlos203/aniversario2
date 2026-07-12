# ============================================================
#  🎵 Descargador de canciones para el sitio del aniversario
#
#  1. Pega el enlace de YouTube de cada canción aquí abajo 👇
#  2. Ejecuta:  python descargar_musica.py
#  3. Cada canción se guarda como public/music/diaN.mp3
#     (el nombre exacto que el sitio web espera)
#
#  Requisitos (instalar una sola vez, ver comandos en el README
#  o al final de este archivo):
#    - yt-dlp   (pip install yt-dlp)
#    - ffmpeg   (winget install Gyan.FFmpeg)
# ============================================================

CANCIONES = {
    1: "",  # 👈 pega aquí el enlace de YouTube del día 1
    2: "",  # 👈 día 2
    3: "",  # 👈 día 3
    4: "",  # 👈 día 4
    5: "",  # 👈 día 5
    6: "",  # 👈 día 6
    7: "",  # 👈 día 7 (la del aniversario 💜)
}

# Si ya descargaste una canción y quieres reemplazarla,
# borra el archivo public/music/diaN.mp3 y vuelve a ejecutar.

# ============================================================
#  No necesitas tocar nada debajo de esta línea
# ============================================================

import glob
import os
import shutil
import sys

CARPETA_SALIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "music")


def buscar_ffmpeg() -> str | None:
    """Busca ffmpeg en el PATH o en la carpeta donde winget lo instala."""
    encontrado = shutil.which("ffmpeg")
    if encontrado:
        return os.path.dirname(encontrado)

    # winget instala en LOCALAPPDATA pero el PATH solo se actualiza
    # en terminales nuevas; lo buscamos directamente por si acaso.
    local = os.environ.get("LOCALAPPDATA", "")
    patrones = glob.glob(
        os.path.join(local, "Microsoft", "WinGet", "Packages", "Gyan.FFmpeg*", "**", "bin", "ffmpeg.exe"),
        recursive=True,
    )
    if patrones:
        return os.path.dirname(patrones[0])
    return None


def main() -> None:
    try:
        from yt_dlp import YoutubeDL
    except ImportError:
        print("❌ Falta yt-dlp. Instálalo con:  pip install yt-dlp")
        sys.exit(1)

    ffmpeg_dir = buscar_ffmpeg()
    if not ffmpeg_dir:
        print("❌ Falta ffmpeg (convierte el audio a MP3). Instálalo con:")
        print("   winget install Gyan.FFmpeg")
        print("   y luego abre una terminal NUEVA y vuelve a ejecutar este script.")
        sys.exit(1)

    os.makedirs(CARPETA_SALIDA, exist_ok=True)

    pendientes = {dia: url.strip() for dia, url in CANCIONES.items() if url.strip()}
    if not pendientes:
        print("⚠️  No pusiste ningún enlace todavía. Abre descargar_musica.py")
        print("    y pega los enlaces de YouTube en la lista CANCIONES.")
        sys.exit(0)

    exitos, fallos = [], []

    for dia, url in pendientes.items():
        destino = os.path.join(CARPETA_SALIDA, f"dia{dia}.mp3")
        if os.path.exists(destino):
            print(f"⏭️  Día {dia}: ya existe dia{dia}.mp3, lo salto (bórralo si quieres reemplazarlo).")
            continue

        print(f"\n🎵 Descargando canción del día {dia}...")
        opciones = {
            "format": "bestaudio/best",
            "outtmpl": os.path.join(CARPETA_SALIDA, f"dia{dia}.%(ext)s"),
            "ffmpeg_location": ffmpeg_dir,
            "noplaylist": True,
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }
            ],
        }
        try:
            with YoutubeDL(opciones) as ydl:
                ydl.download([url])
            exitos.append(dia)
            print(f"✅ Día {dia} listo: public/music/dia{dia}.mp3")
        except Exception as e:  # noqa: BLE001 - queremos continuar con las demás
            fallos.append(dia)
            print(f"❌ Día {dia} falló: {e}")

    print("\n" + "=" * 50)
    if exitos:
        print(f"✅ Descargadas: {', '.join(f'día {d}' for d in exitos)}")
    if fallos:
        print(f"❌ Fallaron: {', '.join(f'día {d}' for d in fallos)}")
        print("   Prueba actualizar yt-dlp:  pip install --upgrade yt-dlp")
    print("💜 ¡Listo! Recarga el sitio para escucharlas.")


if __name__ == "__main__":
    main()
