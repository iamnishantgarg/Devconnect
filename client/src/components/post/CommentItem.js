import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeComment } from "../../actions/post";
import Moment from "react-moment";
import { Link } from "react-router-dom";
// import { profile_url } from "gravatar";
const CommentItem = ({
  postId,
  comment: { user, date, text, avatar, _id, name },
  removeComment,
  auth,
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
        </p>
      </div>
      {!auth.loading && auth.user._id === user && (
        <button
          className="btn btn-danger"
          onClick={() => removeComment(postId, _id)}
        >
          X
        </button>
      )}
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  removeComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { removeComment })(CommentItem);
