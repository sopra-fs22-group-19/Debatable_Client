import React, { useState, useRef, useEffect } from "react";
import {Button} from 'components/ui/Button';
import "styles/ui/FilterComponent.scss";
import Topics from "../views/Topics";


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
                return;
            }
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("touchstart", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("touchstart", handleClick);
        };
    }, [dropdownRef, buttonRef]);

    const applyFilters = () =>{

        localStorage.setItem('categories', selectedFrameworks);
        setIsOpen(false);
        window.location.reload(false);
    };

    return (
        <div className="filter_wrapper">
            <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="filter_button">Filter</button>

            {isOpen && (
                <div ref={dropdownRef} className="filter_dropdown">

                        {frameworks.map((framework, index) => {const isSelected = selectedFrameworks.includes(framework);
                            return (
                                <label key={index}>
                                    <input type="checkbox" checked={isSelected} onChange={() => handleSelect(framework)}/>
                                    <span className="ms-lg-1 text-base text-gray-500 font-heading">{framework}</span>
                                </label>
                            );
                        })}
                        <div className="filter_dropdown_actions">
                            <button onClick={() => applyFilters()} className="filter_dropdown_button">Apply</button>
                        </div>

                </div>
            )}
        </div>
    );
}
