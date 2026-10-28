// import React from 'react';
// import { useDropzone } from 'react-dropzone';

// interface Props {
//   onRawTextLoaded: (text: string) => void;
// }

// export function DragNDropComponent({ onRawTextLoaded }: Props) {
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: { 'text/plain': ['.txt'] },
//     maxFiles: 1,
//     onDrop: function (acceptedFiles) {
//       if (acceptedFiles.length === 0) return;

//       const reader = new FileReader();
//       reader.onload = function (e) {
//         onRawTextLoaded(e.target?.result as string);
//       };
//       reader.readAsText(acceptedFiles[0]);
//     }
//   });

//   return (
//     <div {...getRootProps()} className='py-5 px-10 border-3 border-white'>
//       <input {...getInputProps()} />
//       <p>{isDragActive ? 'Принимаю...' : 'Грузим данные'}</p>
//     </div>
//   );
// }

import React from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  onRawTextLoaded: (bits: string) => void;
  onError?: (err: Error) => void;
}

export function DragNDropComponent({ onRawTextLoaded, onError }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop: function (acceptedFiles) {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const buf = e.target?.result;
        if (!(buf instanceof ArrayBuffer)) {
          onError?.(new Error('Не удалось прочитать файл'));
          return;
        }

        const bytes = new Uint8Array(buf);
        let bits = '';
        for (let i = 0; i < bytes.length; i++) {
          bits += bytes[i].toString(2).padStart(8, '0');
        }

        onRawTextLoaded(bits);
      };

      reader.onerror = function () {
        onError?.(reader.error ?? new Error('Ошибка чтения файла'));
      };

      reader.readAsArrayBuffer(file); 
    }
  });

  return (
    <div {...getRootProps()} className='py-5 px-10 border-3 border-white'>
      <input {...getInputProps()} />
      <p>{isDragActive ? 'Принимаю...' : 'Грузим данные'}</p>
    </div>
  );
}