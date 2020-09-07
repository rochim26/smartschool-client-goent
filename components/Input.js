import React from "react";

const Input = ({ type, id, value, onChange, label, name }) => {
  return (
    <div>
      <div className="form-group">
        {label ? (
          <label htmlFor={id}>
            {label}
            {id == "gmeet" ? (
              <a href="https://meet.google.com" target="_blank">
                Ambil Link disini
              </a>
            ) : null}
          </label>
        ) : null}

        <input
          type={type || "text"}
          className="form-control"
          id={id}
          value={value}
          onChange={(e) => onChange(e)}
          name={name}
          required
        />
      </div>
    </div>
  );
};

export default Input;
