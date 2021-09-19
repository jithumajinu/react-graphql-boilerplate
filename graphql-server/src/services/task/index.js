import { gql } from "apollo-server-express"

let todos = [
  {
    id: Date.now().toString(),
    text: 'Hello from GraphQL 1',
    completed: true,
  },
];

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    createTodo: (parent, args, context, info) => {

      return todos.push({
        id: Date.now().toString(),
        text: args.text,
        completed: false,
      });
    },
    removeTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos.splice(i, 1);
        }
      }
      return args.id;
    },
    updateTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos[i].completed = !todos[i].completed;
        }
      }
      return args.id;
    }
  }
};

export default resolvers;