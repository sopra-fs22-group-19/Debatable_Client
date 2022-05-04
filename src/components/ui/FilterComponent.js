import React, { useState, useRef, useEffect } from "react";
import "styles/ui/FilterComponent.scss";


export default function FilterComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(undefined);
    const buttonRef = useRef(undefined);
    const frameworks = ["Science", "History" , "Sports" , "Health" , "Art", "Entertainment", "Politics", "Culture", "Economics", "Education", "Other"];

    const [selectedFrameworks, setSelectedFrameworks] = useState([]);

    const handleSelect = framework => {
        const isSelected = selectedFrameworks.includes(framework);
        const newSelection = isSelected
            ? selectedFrameworks.filter(currentTech => currentTech !== framework)
            : [...selectedFrameworks, framework];
        setSelectedFrameworks(newSelection);
    };


    useEffect(() => {
        const handleClick = event => {
            const isDropdownClicked = dropdownRef.current && dropdownRef.current.contains(event.target);
            const isButtonClicked = buttonRef.current && buttonRef.current.contains(event.target);


            if (isDropdownClicked || isButtonClicked) {
                // We would do nothing if the ref is undefined or the user clicks on the menu.
                return;
            }
            // Or else close the menu.
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("touchstart", handleClick);

        // cleanup
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("touchstart", handleClick);
        };
    }, [dropdownRef, buttonRef]);

    const applyFilters = () =>{

        localStorage.setItem('categories', selectedFrameworks);
        setIsOpen(false);
    };

    return (
        <div className="filter_wrapper">
            <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="filter_button">JS Frameworks</button>

            {isOpen && (
                <div ref={dropdownRef} className="filter_dropdown">
                    <div>
                        {frameworks.map((framework, index) => {const isSelected = selectedFrameworks.includes(framework);
                            return (
                                <label key={index}>
                                    <input type="checkbox" checked={isSelected} onChange={() => handleSelect(framework)}/>
                                    <span className="ml-2 text-base text-gray-500 font-heading">{framework}</span>
                                </label>
                            );
                        })}
                        <div className="filter_dropdown_actions">
                            <button onClick={() => applyFilters()} className="filter_dropdown_button"> Select </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}