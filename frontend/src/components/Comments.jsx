// frontend/src/components/Comments.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCommentsByVideoId, deleteComment, updateComment, addComment } from '../Redux/slice/commentsSlice';
import { FaUserCircle } from 'react-icons/fa';
import { useToast } from '../hooks/use-toast';

// Comment Component: Represents a single comment with options to edit or delete
const Comment = ({ comment, videoId }) => {
  const [isEditing, setIsEditing] = useState(false);  
  const [newComment, setNewComment] = useState(comment.text);  
  const [menuVisible, setMenuVisible] = useState(false);  
  const { toast } = useToast();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);

  const handleEdit = () => {
    dispatch(updateComment({ videoId, commentId: comment._id, newComment }))
      .then(() => {
        setIsEditing(false);
        toast({
          title: "Comment updated successfully!",
        });
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  };

  const handleDelete = () => {
    dispatch(deleteComment({ videoId, commentId: comment._id }))
      .then(() => {
        toast({
          title: "Comment deleted successfully!",
        });
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
  };

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <div className="flex items-start gap-4 border-b p-4">
      <div>
        <img className="w-10 h-10 rounded-full" src={comment.userAvatar || FaUserCircle} alt="User Avatar" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{comment.userName}</span>
          {currentUser && currentUser._id === comment.userId && (
            <div className="relative">
              <button onClick={toggleMenu} className="text-gray-500">...</button>
              {menuVisible && (
                <div className="absolute right-0 bg-white border rounded shadow p-2">
                  {!isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(true)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Edit</button>
                      <button onClick={handleDelete} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Delete</button>
                    </>
                  ) : (
                    <button onClick={handleEdit} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Save</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border rounded w-full"
          />
        ) : (
          <p>{comment.text}</p>
        )}
      </div>
    </div>
  );
};

// Comments Component: Handles fetching and rendering all comments for a specific video
const Comments = ({ videoId }) => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const comments = useSelector((state) => state.comments.comments);
  const { toast } = useToast();

  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    dispatch(fetchCommentsByVideoId(videoId));
  }, [videoId, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!authStatus) {
      toast({
        variant: "destructive",
        title: "Please log in to add a comment.",
      });
      return;
    }

    if (commentText) {
      dispatch(addComment({ videoId, comment: commentText }))
        .then(() => {
          setCommentText('');
          toast({
            title: "Comment added successfully!",
          });
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      {/* Form to add a new comment */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="border rounded w-full p-2"
        />
        <div className="mt-2 text-right">
          <button type="submit" className="bg-black text-white p-2 px-5 rounded-full">Submit</button>
        </div>
      </form>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} videoId={videoId} />
      ))}
    </div>
  );
};

export default Comments;
