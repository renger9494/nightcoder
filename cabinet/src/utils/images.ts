export function getPlaceholderUrl(): string {
    return process.env.VUE_APP_BUCKET_NAME + '/Defaults/placeholder.svg'
}
export function formatBytes(size: number | undefined | null): string {
    if (!size) return '0'
    var units = ['b', 'Kb', 'Mb', 'Gb'], i

    for (i = 0; size >= 1024 && i < 4; i++) {
        size /= 1024
    }

    return size.toFixed(2) + units[i]
}