<div className="form-group">
              <label htmlFor="systemMapping">System Mapping*</label>
              <select
                id="systemMapping"
                name="systemMapping"
                value={formData.systemMapping}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select system status...</option>
                {systemStatuses.map(sysStatus => (
                  <option key={sysStatus.code} value={sysStatus.code}>
                    {sysStatus.label} ({sysStatus.code})
                  </option>
                ))}
              </select>
              <small className="form-hint">
                Map this custom status to a system status for internal processing
              </small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isFinal"
                  checked={formData.isFinal}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Final Status (No further transitions allowed)
              </label>
            </div>
          </div>