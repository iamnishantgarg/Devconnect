import { POST_ERROR, GET_POSTS, UPDATE_LIKES } from "../actions/types";
const initialState = {
  posts: [],
  post: null,
  loading: true,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case POST_ERROR:
      return { ...state, loading: false, errors: payload };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };

    default:
      return state;
  }
}
