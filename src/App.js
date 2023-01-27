import { useEffect, useState } from "react";
import QuestionBlock from "./components/QuestionBlock";

function App() {
	const [content, setContent] = useState(null);
	const [questions, setQuestions] = useState({});
	const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
	const [showPrevButton, SetShowPrevButton] = useState(false);

	const substances = content?.substances;
	const currentQuestion = questions ? questions["question" + currentQuestionNumber] : "question1";

	async function fetchData() {
		try {
			const response = await fetch("http://localhost:8000/e-assist");
			const responseJSON = await response.json();
			setContent(responseJSON);
		} catch (error) {
			console.log("Error! Could not fetch data." + error);
		}
	}

	function handleNextButtonClick() {
		setCurrentQuestionNumber((prevQuestionNum) => {
			let numQuestions = Object.keys(questions).length;
			// End of questions.
			if (prevQuestionNum === numQuestions) return prevQuestionNum;

			return prevQuestionNum + 1;
		});
	}

	function handlePrevButtonClick() {
		setCurrentQuestionNumber((prevQuestionNum) => {
			if (prevQuestionNum === 1) {
				return prevQuestionNum;
			}

			return prevQuestionNum - 1;
		});
	}

	function togglePrevButton(currentQuestionNumber) {
		currentQuestionNumber === 1 ? SetShowPrevButton(false) : SetShowPrevButton(true);
	}

	useEffect(() => fetchData, []);
	useEffect(() => setQuestions(content?.questions), [content]);
	useEffect(() => togglePrevButton(currentQuestionNumber), [currentQuestionNumber]);

	return (
		<div className="app-container">
			{!content ? (
				"Loading.."
			) : (
				<div className="questions-container">
					{showPrevButton && <button onClick={() => handlePrevButtonClick()}>Previous</button>}
					<button onClick={() => handleNextButtonClick()}>Next</button>
					<QuestionBlock
						question={currentQuestion}
						substances={substances}
						allSubstanceScores={currentQuestion.substanceScores}
					/>
				</div>
			)}
		</div>
	);
}

export default App;
