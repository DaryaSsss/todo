import {
  useFirestoreCollectionMutation,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import { collection } from 'firebase/firestore';
import { useState } from 'react';
import Todos from '../components/Todos';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { generatePushID } from '../helpers';


const Home = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [uploadedFile, setUploadedFile] = useState([])


  const refTodos = collection(firestore, 'todos');

  const firestoreQuery = useFirestoreQuery(['todos'], refTodos);
  const mutationCreateTodo = useFirestoreCollectionMutation(refTodos);

  const handleTodo = async e => {
    const ID = generatePushID();
    onFileUpload({ID});
    e.preventDefault();
    mutationCreateTodo.mutate({
      name,
      desc,
      date,
      isDone: false,
      id:ID
    });
    await firestoreQuery.refetch();
  };

  const onFileUpload = ({ID}) => {
    if (uploadedFile === null) return;
  
    Array.from(uploadedFile).forEach(async file => {  
    const fileRef = ref(storage, `/${ID}/${file.name}`)
    uploadBytes(fileRef, file)
    });
  }

  return (
    <div>
      <h1 className="App-header">Your TO-DO list</h1>
      <div className="Home">
        <form onSubmit={handleTodo}>
          <div className="CreateTodo">
            <h2>Create a new to-do</h2>
            <label>Name*</label>
            <input
              type="text"
              maxLength={32}
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              required
            />
            <label>Descripiton*</label>
            <textarea
              rows={5}
              value={desc}
              onChange={e => setDesc(e.currentTarget.value)}
              required
            />
            <label>Deadline*</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.currentTarget.value)}
              required
            />
            <input type="file" multiple onChange={(e) => setUploadedFile(e.target.files)} />
            <button type="submit" disabled={mutationCreateTodo.isLoading}>
              Save to-do
            </button>
          </div>
        </form>
        <div>
          {firestoreQuery.isLoading ? (
            <div>Loading...</div>
          ) : (
            <Todos todos={firestoreQuery.data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
