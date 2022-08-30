import { ref, watch, Ref } from '@vue/composition-api';
import http from '@/utils/http';

type EventData = { event: string; data: any };

/*
 * Хук для организации загрузки файлов
 */
export default function useFileUpload({
  url,
  allowedFileTypes,
  dataTransfer
}: {
  url: string;
  allowedFileTypes: string[];
  dataTransfer: Ref<DataTransfer>;
}) {
  const event = ref(null as EventData | null);
  const loading = ref(false);
  const preview = ref(null as string | ArrayBuffer | null);

  function isFileTypeAllowed(fileType: string) {
    if (!allowedFileTypes) return true;
    return allowedFileTypes.findIndex(type => type === fileType) !== -1;
  }

  async function uploadFiles(dataTransfer: DataTransfer) {
    if (dataTransfer.files.length === 0) {
      event.value = { event: 'error', data: `No files in dataTransfer` };
      return;
    }

    const file = dataTransfer.files[0];

    if (!isFileTypeAllowed(file.type)) {
      event.value = { event: 'error', data: `Not allowed file type:${file.type}` };
      return;
    }

    //TODO: maybe remove this
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      readerEvent => {
        preview.value = readerEvent.target?.result ?? null;
      },
      false
    );
    reader.readAsDataURL(file);

    try {
      loading.value = true;
      event.value = { event: 'loading', data: dataTransfer };

      const formData = new FormData();
      formData.append('files', file);

      const response = await http.post(url, formData);

      loading.value = false;
      event.value = { event: 'loaded', data: response.data[0] };
    } catch (error) {
      loading.value = false;
      if (error.message === 'Request Entity Too Large') {
        event.value = { event: 'error', data: 'Sorry, the file is too large' };
      } else {
        event.value = { event: 'error', data: error };
      }
    }
  }

  dataTransfer && watch(dataTransfer, () => uploadFiles(dataTransfer.value));

  return { event, preview, loading };
}
