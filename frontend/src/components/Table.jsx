import PropTypes from "prop-types";
import "../App.css";

const Table = ({ columns, data, onDelete, onEdit }) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="w-4/5">
      <div className="w-full overflow-auto rounded-lg">
        <table
          border="1"
          className="parkinsans-font table-auto w-full rounded height"
        >
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="whitespace-nowrap">
                  {capitalize(col)}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col === "status" ? (
                        <span
                          style={{
                            color:
                              row[col] === "pending"
                                ? "#EE9B0F"
                                : row[col] === "completed"
                                ? "green"
                                : "inherit",
                            backgroundColor:
                              row[col] === "pending"
                                ? "rgba(255, 255, 0, 0.2)"
                                : row[col] === "completed"
                                ? "rgba(0, 255, 0, 0.2)"
                                : "transparent",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                          }}
                        >
                          {capitalize(row[col])}
                        </span>
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}
                  <td>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        cursor: "pointer",
                        color: "dodgerblue",
                        marginRight: "10px",
                      }}
                      onClick={() => onEdit(row)}
                    >
                      edit_square
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => onDelete(row._id)}
                    >
                      delete
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{ textAlign: "center" }}
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default Table;
