import TodoCard from "./TodoCard";

const Todos = ({ todos }) => {
  return (
    <div className="Cards">
      {todos.docs.map(todo => {
        const data = todo.data();
        return <TodoCard data={data} id={todo.id} key={todo.id} />;
      })}
    </div>
  );
};

export default Todos;
