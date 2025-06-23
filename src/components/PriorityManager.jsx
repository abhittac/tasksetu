// Helper function moved outside component
const getSystemPriorityLabel = (systemCode, systemPriorities) => {
  const systemPriority = systemPriorities.find(p => p.code === systemCode)
  return systemPriority ? systemPriority.label : systemCode
}

function CompanyPriorityRow({ priority, systemPriorities, onEdit, onDelete, onSetDefault, canEdit }) {

  return (
    <tr>
      <td>{priority.name}</td>
      <td>
        <div className="system-mapping-display">
          <span className="system-priority-label">
            {getSystemPriorityLabel(priority.systemMapping, systemPriorities)}
          </span>
        </div>
      </td>
      <td>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onSetDefault}>Set Default</button>
      </td>
    </tr>
  );
}

export default CompanyPriorityRow;