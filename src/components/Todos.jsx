import TodoCard from "./TodoCard";

/** 
 * @module component maping all todos with todo cards
 * @param { any } todos - array of todos from firestore
 */

const Todos = ({ todos }) => {
  return (
    <div className="Cards">
      {todos.map(todo => {
        return <TodoCard data={todo} id={todo.id} key={todo.id} />;
      })}
    </div>
  );
};

export default Todos;
