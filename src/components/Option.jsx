import { useEffect, useState } from "react";

function replaceSpecialCharsInString(str, replaceStr = "") {
	return str.replace(/[\s\W]/gi, replaceStr);
}

function Option({ questionNumber, categoryId, selectedOptions, optionText, score, handleChange }) {
	// convert to lowercase and remove spaces, special characters.
	let optionTextWithHyphens = replaceSpecialCharsInString(optionText.toLowerCase(), "-");

	let radioButtonId = `radio-${categoryId}-${optionTextWithHyphens}`; // ex: radio-cannabis-no
	radioButtonId = replaceSpecialCharsInString(radioButtonId, "-"); // Remove multiple hyphens.

	const [isChecked, setIsChecked] = useState(false);
	useEffect(() => {
		setIsChecked(false);
		let key = "question" + questionNumber;

		if (selectedOptions[key]) {
			if (selectedOptions[key][categoryId]?.text === optionText) {
				setIsChecked(true);
			}
		}
	}, [selectedOptions, categoryId, questionNumber, optionText]);

	return (
		<div className="form-check radio-spacing option-group">
			<input
				className="form-check-input"
				type="radio"
				name={categoryId}
				id={radioButtonId}
				value={score}
				checked={isChecked}
				onChange={handleChange}
				data-option-text={optionText}
				required
			/>
			<label className="form-check-label" htmlFor={radioButtonId}>{optionText}</label>
		</div>
	);
}

export default Option;
