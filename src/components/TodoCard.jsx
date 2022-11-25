import dayjs from 'dayjs';
import {
  useFirestoreDocumentDeletion,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import { useState } from 'react';
import { isDayExpired } from '../helpers';
import { firestore } from '../firebase';

const TodoCard = ({ data, id }) => {
  const deleteFrom = collection(firestore, 'todos');
  const refDelete = doc(deleteFrom, id);
  const mutationDeleteTodo = useFirestoreDocumentDeletion(refDelete);

  const [type, setType] = useState('view');

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [isDone, setIsDone] = useState('');

  const updateWhere = collection(firestore, 'todos');
  const refUpdate = doc(updateWhere, id);
  const mutationUpdateTodo = useFirestoreDocumentMutation(refUpdate);

  const handleTodo = async e => {
    e.preventDefault();
    await mutationUpdateTodo.mutate({
      name,
      desc,
      date,
    });
    setType('view');
  };

  return (
    <div>
      {type === 'view' ? (
        <div className="Card">
          <div className="Info">
            <div className="CardHeader">
              <input
                type="checkbox"
                checked={data.isDone}
                value={isDone}
                onChange={() => {
                  mutationUpdateTodo.mutate({
                    isDone,
                  });
                }}
              />
              <p className={!data.isDone ? 'Name' : 'Name Done'}>{data.name}</p>
              <p className={!isDayExpired(data.date) ? 'Date' : 'Date Expired'}>
                {dayjs(data.date).format('DD/MM/YYYY')}
              </p>
            </div>
            <p className="Desc">{data.desc}</p>
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
                <input type="checkbox" checked={data.isDone} />
                <input
                  type="text"
                  maxLength={32}
                  value={name}
                  placeholder={data.name}
                  onChange={e => setName(e.currentTarget.value)}
                  required
                />
                <input
                  type="date"
                  value={date}
                  placeholder={dayjs(data.date).format('YYYY/MM/DD')}
                  onChange={e => setDate(e.currentTarget.value)}
                  required
                />
              </div>
              <textarea
                rows={5}
                value={desc}
                placeholder={data.desc}
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
