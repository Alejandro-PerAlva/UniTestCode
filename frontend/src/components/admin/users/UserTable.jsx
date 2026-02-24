import React from 'react';
import PropTypes from 'prop-types';

/**
 * UserTable - Componente visual para listar usuarios.
 * Muestra nombre, email y botones de acción.
 */
const UserTable = ({ users, filterRole, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="mgmt-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id || u._id}>
                <td>
                  <div className="user-info">
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role}`}>
                    {u.role === 'teacher' ? '🎓 Professor' : '👨‍🎓 Student'}
                  </span>
                </td>
                <td>
                  <div className="action-group-btns">
                    <button 
                      onClick={() => onEdit(u)} 
                      className="action-icon-btn edit" 
                      title="Edit user"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => onDelete(u)} 
                      className="action-icon-btn delete" 
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-row">
                No {filterRole}s found in the system.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterRole: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserTable;