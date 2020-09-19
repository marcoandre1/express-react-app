/**
 * The task detail component route is a more sophisticated form that has many different fields.
 * The component automatically calls the REST API [via a mutation] to update the server on every change.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const TaskDetail = ({
                        id,
                        comments,
                        task,
                        isComplete,
                        groups
                    })=>{
    return (
        <div className="card p-3 col-6">
            <div>
                <input type="text" value={task.name} className="form-control form-control-lg"/>
            </div>

            <form className="form-inline">
                <span className="mr-4">
                    Change Group
                </span>
                <select className="form-control">
                    {groups.map(group=>(
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </form>

            <form className="form-inline">
                <input type="text" name="commentContents" autoComplete="off" placeholder="Add a comment" className="form-control"/>
                <button type="submit" className="btn">Submit</button>
            </form>

            <div>
                <Link to="/dashboard">
                    <button className="btn btn-primary mt-2">
                        Done
                    </button>
                </Link>
            </div>
        </div>
    )
}

function mapStateToProps(state,ownProps){
    let id = ownProps.match.params.id;
    let task = state.tasks.find(task=>task.id === id);
    let groups = state.groups;

    return {
        id,
        task,
        groups,
        isComplete: task.isComplete
    }
}

export const ConnectedTaskDetail = connect(mapStateToProps)(TaskDetail);
