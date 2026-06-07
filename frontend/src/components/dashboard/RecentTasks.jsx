// RecentTasks.jsx
import React from 'react';

const RecentTasks = ({ tasks = [] }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="recent-tasks">
                <h3>Recent Tasks</h3>
                <p>No tasks available. Create your first task!</p>
            </div>
        );
    }

    return (
        <div className="recent-tasks">
            <h3>Recent Tasks</h3>
            <div className="tasks-list">
                {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="task-item">
                        <span className="task-title">{task.title}</span>
                        <span className={`task-status ${task.status}`}>{task.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentTasks;