import dayjs from 'dayjs';
import {
  useFirestoreDocumentDeletion,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import { useReducer, useState } from 'react';
import { isDayExpired } from '../helpers';
import { firestore, storage } from '../firebase';
import { ref, getDownloadURL, listAll } from "firebase/storage";


const TodoCard = ({ data, id }) => {
  const deleteFrom = collection(firestore, 'todos');
  const refDelete = doc(deleteFrom, id);
  const mutationDeleteTodo = useFirestoreDocumentDeletion(refDelete);

  const [type, setType] = useState('view');

  const [name, setName] = useState(data.name);
  const [desc, setDesc] = useState(data.desc);
  const [date, setDate] = useState(data.date);
  const [isDone, setIsDone] = useState(data.isDone);

  const updateWhere = collection(firestore, 'todos');
  const refUpdate = doc(updateWhere, id);
  const mutationUpdateTodo = useFirestoreDocumentMutation(refUpdate);

  const handleTodo = async e => {
    e.preventDefault();
    await mutationUpdateTodo.mutate({
      isDone,
      name,
      desc,
      date,
    });
    setType('view');
  };

  const ListAll = (id) => {
    // const storageRef = storage().ref()
    // let listRef = storageRef.child(id)

    // listRef.ListAll().then((res) => {
    //   res.items.forEach((itemRef) => {
    //     itemRef.getDownloadURL().then((url) => {
    //       console.log('URL', url)
    //     });
    //   });
    // })
    // .catch((error) => {
    //   console.log('error', error)
    // })

    const listRef = ref(storage, data.id);

    listAll(listRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });
        res.items.forEach((itemRef) => {
              getDownloadURL(itemRef).then((url) => {
                console.log('URL', url)
              });
            });
      }).catch((error) => {
        console.log('error', error)
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
                onChange={() => {
                  const newIsDone = !isDone
                  setIsDone(newIsDone)
                  mutationUpdateTodo.mutate({
                    isDone: newIsDone,
                    name: data.name,
                    desc: data.desc,
                    date: data.date,
                  });
                }}
              />
              <p className={!isDone ? 'Name' : 'Name Done'}>{data.name}</p>
              <p className={!isDayExpired(data.date) ? 'Date' : 'Date Expired'}>
                {dayjs(data.date).format('DD/MM/YYYY')}
              </p>
            </div>
            <p className="Desc">{data.desc}</p>
            <div className='Files'>
            {/* {data.files.map((file) => {
              const fileRef = ref(storage, file)
              getDownloadURL(fileRef).then((url) => {
              console.log(url);
             });
            })} */}
            {ListAll(id)}
            </div>
          </div>
          <div className="Actions">
            <button
              type="button"
              className="Delete"
              disabled={mutationDeleteTodo.isLoading}
              onClick={() => {
                mutationDeleteTodo.mutate();
              }}
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
