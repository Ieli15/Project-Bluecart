import React from 'react';

const FilterPanel = ({ filters }) => {
  return (
    <div>
      {filters.map((filter, index) => (
        <div key={index}> {/* Added unique key prop */}
          {/* ...existing code... */}
        </div>
      ))}
    </div>
  );
};

export default FilterPanel;