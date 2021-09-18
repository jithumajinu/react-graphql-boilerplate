import React from 'react';
import './styles/App.css';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Avatar from 'react-avatar';
import gql from "graphql-tag";

const READ_TODOS = gql`
  query todos{
    todos {
      id
      text
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text)
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!) {
    updateTodo(id: $id)
  }
`;

function App() {
  let input;
  const { data, loading, error } = useQuery(READ_TODOS);
  const [createTodo] = useMutation(CREATE_TODO);
  const [deleteTodo] = useMutation(REMOVE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);

  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const onClickSubmit = (e) => {
    console.log("Btn click");
    e.preventDefault();
    createTodo({
       variables: { text: input.value },
       refetchQueries: ['todos']
      });
    input.value = '';
    // window.location.reload();
  }

  const onClickUpdateTodo =  async (id) => {
    console.log("Update click");
    await updateTodo({
      variables: { id: id },
      refetchQueries: ['todos']
    });
  }

  const onClickDeleteTodo = (id) => {
    console.log("Update click");
    deleteTodo({ 
      variables: { id: id },
      refetchQueries: ['todos']
    });
  }

  return (
    <div className="app">
      <h3><Avatar
        round={true}
        size='50'
        color='gray'
        src="public/logo192.png"
      /> Graphql client App</h3>
      <div className="row">
        <div className="col-md-7">
          <form>
            <div className="form-group">
              <input className="form-control" type="text" placeholder="Enter todo" ref={node => { input = node; }}></input>
            </div>
            <div className="form-group">
              <button className="btn btn-primary px-5 my-2"
                onClick={(e) => {
                  onClickSubmit(e);
                }} >Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        <h3>Todo List</h3>
      </div>
      {data.todos.map((todo) =>
        <div className="row" key={todo.id}>
          <div className="col-md-4">
            <span className={todo.completed ? "done" : "pending"}>{todo.text}</span>
          </div>
          <div className="col-md-2">
            <button className={`btn btn-sm float-right ${todo.completed ? "btn-success" : "btn-info"}`}
              onClick={(e) => {
                onClickUpdateTodo(todo.id);
              }}
            >
              {todo.completed ? <span>Completed</span> : <span>Not completed</span>}</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-sm btn-danger float-right"
              onClick={() => {
                onClickDeleteTodo(todo.id);
              }}
            >Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;