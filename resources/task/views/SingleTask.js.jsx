/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as taskActions from '../taskActions';
import * as noteActions from '../../note/noteActions'

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import TaskLayout from '../components/TaskLayout.js.jsx';


class SingleTask extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      comments: ""
    }
    this._bind(
      'handleInput',
      'handleAddCommentButton'
    );
  }

  componentDidMount() {
    const { dispatch, match, taskStore } = this.props;
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    dispatch(noteActions.fetchList(["_task", match.params.taskId]))
  }

  handleApprovalButton(data, status) {
    const { dispatch } = this.props;
    const update_data = {
      ...data,
      status
    }
    dispatch(taskActions.sendUpdateTask(update_data)).then(taskRes => {
      if(taskRes.success) {
        // history.push(`/tasks/${taskRes.item._id}`)
      } else {
        alert("ERROR - Check logs");
      }
    });

  }

  handleAddCommentButton(e){
    const { dispatch, taskStore, user, flow,match } = this.props;
    e.preventDefault();
    const note_data = {
      content: this.state.comments,
      _flow: flow.selected.id,
      _user: user.loggedIn.user._id,
      _task: taskStore.selected.id
    }
    if(this.state.comments){
      this.setState({comments: ""})
      dispatch(noteActions.sendCreateNote(note_data)).then(noteRes => {
        if(noteRes.success) {
          dispatch(noteActions.invalidateList());
          // history.push(`/notes/${noteRes.item._id}`)
          dispatch(noteActions.fetchList(["_task", match.params.taskId]))
        } else {
          alert("ERROR - Check logs");
        }
      });
    }

  }

  handleInput(e) {
    const { value, name } = e.target
    this.setState({[name]: value})
  }

  render() {
    const { taskStore, user, notes } = this.props;
    const { data = [] } = notes
    const { byId } = taskStore ;
    const { loggedIn } = user

    console.log(this.state)
    
    let pictureUrl = '/img/defaults/profile.png';
    let profileImg = {backgroundImage: `url(${pictureUrl})`};


    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    const isEmpty = (
      !selectedTask
      || !selectedTask._id
      || taskStore.selected.didInvalidate
    );

    const isFetching = (
      taskStore.selected.isFetching
    )

    return (
      <TaskLayout>
        <h3> Single Task </h3>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{marginTop: "5%", opacity: isFetching ? 0.5 : 1 }}>
            <div style={{display: "flex", flexDirection: "row", gap: "5%"}}>
              { (selectedTask.status == "awaiting_approval" || selectedTask.status == "approved") ? (<input checked={true} readOnly type="checkbox" style={{height: "30px", width: "30px", accentColor: selectedTask.status == "approved" ? "#588728" : "grey"}} />) : (<input readOnly checked={false} type="checkbox" style={{height: "30px", width: "30px", accentColor: "grey"}} />)}
              <span style={{fontStyle: "bold", fontSize: "50px"}}> { selectedTask.name } </span>
              <Link to={`${this.props.match.url}/update`}> Update Task </Link>
            </div>
            <p>{selectedTask.description}</p>
            {
              (loggedIn.user.roles[0] === "admin" && selectedTask.status === "awaiting_approval") && (
                <div>
              <button style={{marginRight: "5%"}} className="yt-btn success" onClick={() => this.handleApprovalButton(selectedTask, "approved")}>Approve</button>
              <button className="yt-btn danger" onClick={() => this.handleApprovalButton(selectedTask, "open")}>Reject</button>
              </div>
              )
            }

            <hr/>
            <div>
              {
                 data.length ? data.map((data, i) => {
                  return (
                    <div style={{display: "flex", flexDirection: "row"}}>
                      <div className="-profile-pic" style={profileImg}> </div>
                      <div style={{display: "flex", flexDirection: "column"}} key={data._id + i}>
                        <span style={{fontWeight: "bold"}}>{data.firstname} {data.lastname}</span>
                        <span style={{fontSize: "12px", opacity: "0.5"}}>{data.created}</span>
                        <span>{data.content}</span>
                      </div>
                    </div>
                  )
                }) : null
              }
            </div>
            <hr/>
            <div>
              <textarea name="comments" value={this.state.comments} onChange={this.handleInput} style={{width: "40%", height: "150px", resize: "none"}} />
              <br />
              <button className="yt-btn primary bordered x-small" onClick={this.handleAddCommentButton}>Add Comment</button>
            </div>
          </div>
        }
      </TaskLayout>
    )
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    taskStore: store.task,
    user: store.user,
    notes: store.note,
    flow: store.flow
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(SingleTask)
);
