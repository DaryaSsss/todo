import dayjs from 'dayjs';
import {
  useFirestoreDocumentDeletion,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { isDayExpired } from '../helpers';
import { firestore, storage } from '../firebase';
import { ref, getDownloadURL, listAll, deleteObject,uploadBytes } from "firebase/storage";
import { IconX } from '@tabler/icons';


const TodoCard = ({ data, id }) => { 
  const [type, setType] = useState('view');
  const [name, setName] = useState(data.name);
  const [desc, setDesc] = useState(data.desc);
  const [date, setDate] = useState(data.date);
  const [isDone, setIsDone] = useState(data.isDone);
  const [files, setFiles] = useState([])
  const [uploadedFile, setUploadedFile] = useState([])
  const [refetchFiles, setRefetchFiles] = useState(true)

  const deleteFrom = collection(firestore, 'todos');
  const refDelete = doc(deleteFrom, id);
  const mutationDeleteTodo = useFirestoreDocumentDeletion(refDelete);

  const updateWhere = collection(firestore, 'todos');
  const refUpdate = doc(updateWhere, id);
  const mutationUpdateTodo = useFirestoreDocumentMutation(refUpdate);

  useEffect(() => { console.log(files) }, [files])

  /** function to delete todo with all todo files */
  const handleDelete = () => {
    mutationDeleteTodo.mutate()
    files.map((file) => {
      handleFileDelete(file.children)
    })
  }

  /** function to update todo info (besides info about its completion) */
  const handleTodo = async e => {
    e.preventDefault();
    onFileUpload()
    await mutationUpdateTodo.mutate({
      isDone,
      name,
      desc,
      date,
      fileId: data.fileId,
    });
    setType('view');
    setUploadedFile([])
  };

  /** function to get files for every todo 
   * @returns { any[] } - return array of all files by setting them in files (useState - setFiles)
  */
  useEffect(() => {
    const getFiles = async () => {
      const returnList = []
      const listRef = ref(storage, data.fileId);
      const response = await listAll(listRef)
      for (const itemRef of response.items) {
        const url = await getDownloadURL(itemRef)
        returnList.push({ children: itemRef.name, href: url })
      }
      setFiles(returnList)
    }
    getFiles()
  }, [])

  /** function to delete file from storage 
   * @param { any } fileName - name of file to delete
  */
  const handleFileDelete = async (fileName) => {
    const fileRef = ref(storage, `${data.fileId}/${fileName}`);
    await deleteObject(fileRef);
    setFiles(prev => prev.filter(file => file.children !== fileName))
  }

  /** function to upload files to storage */
  const onFileUpload = async () => {
  if (uploadedFile === null) return;


    for (const file of Array.from(uploadedFile)) {
      const fileRef = ref(storage, `/${data.fileId}/${file.name}`)
      await uploadBytes(fileRef, file)
      const newFile = { children: file.name, href: await getDownloadURL(fileRef) }
      setFiles(prev => [...prev, newFile])
    } 
      // const newRefetchFiles = !refetchFiles
      // setRefetchFiles(newRefetchFiles)
  }

   /** function to update info about todo completion (checkbox) */
  const updateIsDone = () => {
    const newIsDone = !isDone
    setIsDone(newIsDone)
    mutationUpdateTodo.mutate({
      isDone: newIsDone,
      name: data.name,
      desc: data.desc,
      date: data.date,
      fileId: data.fileId,
    });
  }


  return (
    <div>
      {type === 'view' ? (
        <div className="Card">
          <div className="Info">
            <div className="CardHeader">
              <input
                type="checkbox"
                checked={isDone}
                onChange={updateIsDone}
              />
              <p className={!isDone ? 'Name' : 'Name Done'}>{data.name}</p>
              <p className={!isDayExpired(data.date) ? 'Date' : 'Date Expired'}>
                {dayjs(data.date).format('DD/MM/YYYY')}
              </p>
            </div>
            <p className="Desc">{data.desc}</p>
            <div className='Files'>
              {files.map(f => <a {...f} target="_blank" key={f.href}/>)}
            </div>
          </div>
          <div className="Actions">
            <button
              type="button"
              className="Delete"
              disabled={mutationDeleteTodo.isLoading}
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => {
                setType('edit');
              }}
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleTodo}>
          <div className="Card">
            <div className="Info">
              <div className="CardHeader">
                <input
                  type="text"
                  maxLength={32}
                  value={name}
                  placeholder="Title"
                  onChange={e => setName(e.currentTarget.value)}
                  required
                />
                <input
                  type="date"
                  value={date}
                  placeholder="Date"
                  onChange={e => setDate(e.currentTarget.value)}
                  required
                />
              </div>
              <textarea
                rows={5}
                value={desc}
                placeholder="Description"
                onChange={e => setDesc(e.currentTarget.value)}
                required
              />
            <input type="file" multiple onChange={(e) => setUploadedFile(e.target.files)} />
            <div className='Files'>
              {files.map(f => <div className='FileDelete' key={f.href}><a {...f} target="_blank" /><button type="button" className='DeleteIcon' onClick={() => handleFileDelete(f.children)}><IconX /></button></div>)}
            </div>
            </div>
            <div className="Actions">
              <button type="submit" className="Save">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('view');
                }}
              >
                Close
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
export default TodoCard;
