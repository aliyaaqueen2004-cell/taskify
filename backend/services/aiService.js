const openai = require('../config/openai');

/**
 * Generate subtasks and time estimates based on task details
 * @param {string} title 
 * @param {string} description 
 * @returns {Promise<{subtasks: string[], timeEstimateHours: number, rationalization: string}>}
 */
const getTaskBreakdown = async (title, description) => {
  // If OpenAI is not configured, fallback to mock AI recommendations
  if (!openai) {
    console.log('OpenAI not configured. Using Mock AI for task breakdown.');
    return generateMockBreakdown(title, description);
  }

  try {
    const prompt = `
      You are an elite productivity consultant and agile project manager.
      Analyze the following task and generate a structured JSON object containing:
      1. A logical list of 3-7 actionable subtasks.
      2. An estimated number of hours required to complete the task.
      3. A concise rationalization explaining the estimation and task design.

      Task Title: "${title}"
      Task Description: "${description || 'No description provided.'}"

      Respond STRICTLY in JSON format with this structure:
      {
        "subtasks": ["Subtask 1", "Subtask 2", ...],
        "timeEstimateHours": 6,
        "rationalization": "Detailed breakdown because..."
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Cost-effective default
      messages: [
        { role: 'system', content: 'You are a helpful JSON-only output assistant.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      subtasks: result.subtasks || [],
      timeEstimateHours: result.timeEstimateHours || 1,
      rationalization: result.rationalization || 'Derived using AI metrics.',
    };
  } catch (error) {
    console.error('OpenAI API Error: ', error.message);
    return generateMockBreakdown(title, description);
  }
};

/**
 * Mock generator to simulate high-fidelity AI behavior
 */
const generateMockBreakdown = (title, description) => {
  const lowercaseTitle = title.toLowerCase();
  
  let subtasks = [
    'Research implementation requirements and establish criteria',
    'Write baseline components and draft code structures',
    'Perform local testing, debugging, and edge-case handling',
    'Conduct final review and integrate with main environment'
  ];
  let timeEstimateHours = 4;
  let rationalization = 'Estimated based on standard software engineering lifecycles and average developer throughput.';

  if (lowercaseTitle.includes('design') || lowercaseTitle.includes('ui') || lowercaseTitle.includes('wireframe')) {
    subtasks = [
      'Create mood board and establish color palettes/typography',
      'Design low-fidelity wireframes and layout grids',
      'Create high-fidelity mockups for desktop and mobile viewports',
      'Gather peer feedback and export final assets/CSS specifications'
    ];
    timeEstimateHours = 6;
    rationalization = 'Creative UI design requires layout iteration and detail refinement across multiple device sizes.';
  } else if (lowercaseTitle.includes('test') || lowercaseTitle.includes('bug') || lowercaseTitle.includes('debug')) {
    subtasks = [
      'Isolate the defect and reproduce in a sandboxed environment',
      'Review stack traces, network payloads, or application logs',
      'Write regression unit/integration tests to capture the issue',
      'Refactor problematic code block and verify code changes'
    ];
    timeEstimateHours = 3;
    rationalization = 'Debugging effort includes reproduction, isolation, patch formulation, and regression prevention steps.';
  } else if (lowercaseTitle.includes('deploy') || lowercaseTitle.includes('release') || lowercaseTitle.includes('publish')) {
    subtasks = [
      'Verify production build compatibility and run linter checkers',
      'Audit environment variables, secret parameters, and secure values',
      'Configure CI/CD pipelines and push release tag',
      'Perform post-deployment verification tests and smoke checks'
    ];
    timeEstimateHours = 2;
    rationalization = 'Deployment checklist focuses heavily on verification, environment sanity, and deployment validation.';
  } else if (description && description.length > 50) {
    timeEstimateHours = Math.min(12, Math.max(2, Math.floor(description.length / 40)));
    rationalization = `Task complexity analyzed from details (${description.length} characters). Created custom task list accordingly.`;
  }

  return { subtasks, timeEstimateHours, rationalization };
};

module.exports = { getTaskBreakdown };
