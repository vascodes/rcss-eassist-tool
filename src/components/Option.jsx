function replaceSpecialCharsInString(str, replaceStr = "") {
	return str.replace(/[\s\W]/gi, replaceStr);
}

function Option({ categoryName, optionText, score, handleRadioBtnChange }) {
	// convert to lowercase and remove spaces, special characters.
	let categoryNameWithHyphens = replaceSpecialCharsInString(categoryName.toLowerCase(), "-");
	let optionTextWithHyphens = replaceSpecialCharsInString(optionText.toLowerCase(), "-");

	let radioButtonId = `radio-${categoryNameWithHyphens}-${optionTextWithHyphens}`; // ex: radio-cannabis-no
	radioButtonId = replaceSpecialCharsInString(radioButtonId, "-"); // Remove multiple hyphens.

	let selectedCategoryRegex = /yes/gi;
	
	return (
		<div className="option-group">
			<input
				type="radio"
				name={categoryNameWithHyphens}
				id={radioButtonId}
				value={score}
				onChange={handleRadioBtnChange}
				data-is-category-selected = {selectedCategoryRegex.test(optionText) || null}
				required
			/>
			<label htmlFor={radioButtonId}>{optionText}</label>
		</div>
	);
}

export default Option;
