import TodoCard from "./TodoCard";

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
