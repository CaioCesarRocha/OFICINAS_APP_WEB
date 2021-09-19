import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload} from 'react-icons/fi';
import './styles.css';


interface Props{
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props>= ({onFileUploaded}) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(acceptedFiles => {
      const file = acceptedFiles[0];

      const fileURL = URL.createObjectURL(file); //criar a url do arquivo

      setSelectedFileUrl(fileURL);
      onFileUploaded(file)
  }, [onFileUploaded])

  const {getRootProps, getInputProps} = useDropzone({
      onDrop,
      accept: 'image/*', //aceitar qualquer tipo de imagem
    })

  return (
    <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} accept='image/*'/>
        {
            selectedFileUrl
            ?
            <img src={selectedFileUrl} alt = "Mechanical thumbnail"/>
            :
            (
                <p>
                <FiUpload/>
                Imagem do Estabelecimento
                </p>
            )
        }        
    </div>
  )
}

export default Dropzone;