import { useRef, useState } from "react";

import Question from "./Question";
import AlertBox from "../ui/AlertBox";
import PageNavigation from "../ui/PageNavigation";
import CardLayout from "../layouts/CardLayout";

function validateSelectedOptions(substancesOfQuestion, selectedOptions) {
	// Check if none of the options of a question are selected.
	if (!selectedOptions) return false;

	// Check if only some options of question are selected.
	let numSelectedSubstancesOfQuestion =
		Object.keys(selectedOptions).length ?? 0;

	if (numSelectedSubstancesOfQuestion < substancesOfQuestion.length)
		return false;

	return true;
}

function filterSelectedSubstances(selectedAnswersOfQuestion, compareFunction) {
	const filteredSubstances = [];

	for (let substanceId in selectedAnswersOfQuestion) {
		const selectedOptionOfSubstance =
			selectedAnswersOfQuestion[substanceId];

		if (compareFunction(selectedOptionOfSubstance.text.toLowerCase())) {
			filteredSubstances.push(substanceId);
		}
	}

	return filteredSubstances;
}

function QuestionContainer(props) {
	let { allPages, setPage, allQuestions, allSubstances, handleScore } = props;

	console.count("Question Container.");

	const [currentQuestion, setQuestion] = useState(allQuestions[0]);
	const [allSelectedAnswers, setAllSelectedAnswers] = useState({});
	const [showRequiredMessage, setShowRequiredMessage] = useState(false);
	const [questionHistory, setQuestionHistory] = useState([
		currentQuestion.id,
	]);

	const substancesUsedRef = useRef({
		lifetime: new Set(), // Ids of substances selected in Q1,
		past3Months: new Set(), // Ids of Substances selected in Q2.
	});

	const getSubstancesUsed = () => substancesUsedRef.current;

	function setSubstancesUsed({
		substancesUsedInLifetime,
		substancesUsedInPast3Months,
	}) {
		if (substancesUsedInLifetime) {
			substancesUsedRef.current.lifetime = new Set(
				substancesUsedInLifetime,
			);
		}

		if (substancesUsedInPast3Months) {
			substancesUsedRef.current.past3Months = new Set(
				substancesUsedInPast3Months,
			);
		}

		console.log(substancesUsedRef);
	}

	const totalQuestions = allQuestions.length;

	function getSubstances(questionId) {
		const {
			lifetime: substancesUsedInLifetime,
			past3Months: substancesUsedInPast3Months,
		} = getSubstancesUsed();

		// Return all substances for currentQuestion 1 and currentQuestion 8, if exists.
		if (questionId === 1 || questionId === 8) {
			return currentQuestion?.substances;
		} else {
			// For other allQuestions, only return substances selected in Question 1.
			let filteredSubstances = currentQuestion.substances?.filter(
				substance => substancesUsedInLifetime.has(substance.id),
			);

			// For allQuestions 3, 4 and 5, return substances that,
			// were not answered as "Never" in currentQuestion 2.
			if (questionId >= 3 && questionId <= 5) {
				filteredSubstances = filteredSubstances.filter(substance =>
					substancesUsedInPast3Months.has(substance.id),
				);
			}

			return filteredSubstances;
		}
	}

	function pushQuestionHistory(nextQuestionId) {
		const newQuestionHistory = questionHistory;
		newQuestionHistory.push(nextQuestionId);

		setQuestionHistory(newQuestionHistory);
	}

	function popQuestionHistory() {
		const newQuestionHistory = questionHistory;
		newQuestionHistory.pop();

		setQuestionHistory(newQuestionHistory);
	}

	function setSubstancesUsedInLifetime() {
		/*
			If selected option of a substance is "Yes" in Question 1, 
			then it is a substance used in liftime.
		*/
		const substancesUsedInLifetime = filterSelectedSubstances(
			allSelectedAnswers[currentQuestion.id],
			selectedOption => selectedOption === "yes",
		);

		setSubstancesUsed({
			substancesUsedInLifetime: substancesUsedInLifetime,
		});
	}

	function setSubstancesUsedInPast3Months() {
		/*
			If selected option of a substance is not "Never" in Question 2, 
			then it is a substance used in past 3 months.
		*/
		const substancesUsedInPast3Months = filterSelectedSubstances(
			allSelectedAnswers[currentQuestion.id],
			selectedOption => selectedOption !== "never",
		);

		setSubstancesUsed({
			substancesUsedInPast3Months: substancesUsedInPast3Months,
		});
	}

	// Change to previous currentQuestion if nextQuestionId is null else change to next currentQuestion.
	function changeQuestionById(nextQuestionId = null) {
		if (!nextQuestionId) {
			popQuestionHistory();
		} else {
			pushQuestionHistory(nextQuestionId);
		}

		const previousQuestionId = questionHistory.at(-1);
		let index = previousQuestionId - 1;
		setQuestion(allQuestions[index]);
	}

	function getNextQuestionId(currentQuestionId) {
		const { past3Months: substancesUsedInPast3Months } =
			getSubstancesUsed();

		/* 
			If "never" is selected for all options in Question 2
			(ie: no substances were used in past 3 months) then, 
			show Question 6.
		*/
		if (currentQuestionId === 2 && substancesUsedInPast3Months.size === 0) {
			return 6;
		}

		/*
			If only tobacco is NOT selected as "Never" in Q2 
			(ie: if only tobacco is used in past 3 months) then,
			skip to Question 6 after Question 4.
			This is because tobacco should not be displayed in Question 5.
		*/
		if (
			currentQuestionId === 4 &&
			substancesUsedInPast3Months.size === 1 &&
			substancesUsedInPast3Months.has("tobacco")
		) {
			return 6;
		}

		if (currentQuestionId !== totalQuestions) {
			return currentQuestionId + 1;
		}

		return null;
	}

	function handleNextButtonClick() {
		//TODO: Fix bug where required message is shown when one of the substance that was selected is removed and quiz is retaken.

		setShowRequiredMessage(false); // reset required message.

		// Validate selected options of a question.
		const isValidSelectedOptions = validateSelectedOptions(
			getSubstances(currentQuestion.id),
			allSelectedAnswers[currentQuestion.id],
		);

		if (!isValidSelectedOptions) {
			setShowRequiredMessage(true);
			return;
		}

		if (currentQuestion.id === 1) {
			setSubstancesUsedInLifetime();
		}

		if (currentQuestion.id === 2) {
			setSubstancesUsedInPast3Months();
		}

		const { lifetime: substancesUsedInLifetime } = getSubstancesUsed();

		// Show Thank You page if all options are answered as "No" in question 1.
		const isShowThankYouPage = substancesUsedInLifetime.size === 0;
		if (isShowThankYouPage) {
			setPage(allPages.thankYou);
			return;
		}

		const nextQuestionId = getNextQuestionId(currentQuestion.id);
		if (nextQuestionId) {
			changeQuestionById(nextQuestionId);
		} else {
			// Show scores after last question.
			const substanceScores = getSubstanceScores();
			handleScore(substanceScores);
		}
	}

	function handlePrevButtonClick() {
		setShowRequiredMessage(false); // Reset required message.

		if (currentQuestion.id !== 1) changeQuestionById();
	}

	function getSubstanceScores() {
		const substanceScores = {};

		// Initialize scores for all substances as 0.
		for (let substance of allSubstances) {
			substanceScores[substance.id] = 0;
		}

		// Compute total score of each substance.
		for (let questionId in allSelectedAnswers) {
			// Answers of Question 1, Question 8 should not be considered.
			if (questionId === 1 || questionId === 8) {
				continue;
			}

			/*				
				Ignore options of questions in allSelectedAnswers that are not in questionHistory.
				This ensures that only the selected options of visted questions
				are considered when calculating the substance's score.
				
				Example: 
				User might choose options of question 4, 5 but later change 
				the answers of previous question such that question 4 and 5 is skipped. 
				In this case, answers of question 4, 5
				should not be considered when calculating the score.
			*/
			if (!questionHistory.includes(Number(questionId))) {
				continue;
			}

			const selectedSubstances = allSelectedAnswers[questionId];
			for (let substanceId in selectedSubstances) {
				let substance = selectedSubstances[substanceId];

				// Update score of substance in substanceScores.
				if (substanceId in substanceScores)
					substanceScores[substanceId] += Number(substance.score);
			}
		}

		return substanceScores;
	}

	return (
		<CardLayout>
			<Question
				key={currentQuestion?.id}
				question={currentQuestion}
				allSubstances={allSubstances}
				substancesToDisplay={getSubstances(currentQuestion.id)}
				allSelectedAnswers={allSelectedAnswers}
				setAllSelectedAnswers={setAllSelectedAnswers}
				totalQuestions={totalQuestions}
			/>

			{showRequiredMessage && (
				<AlertBox type="danger">
					Please complete all questions on the page to continue.
				</AlertBox>
			)}

			<PageNavigation
				showNextButton
				showPreviousButton={currentQuestion.id !== 1}
				handleNextButtonClick={handleNextButtonClick}
				handlePrevButtonClick={handlePrevButtonClick}
			/>
		</CardLayout>
	);
}

export default QuestionContainer;
