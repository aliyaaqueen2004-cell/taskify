export const chatWithAI = async (userInput, chatHistory = []) => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    // Smart Mock Fallback
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerInput = userInput.toLowerCase();
        
        // If it looks like a task request
        if (lowerInput.includes('remind') || lowerInput.includes('task') || lowerInput.includes('need to') || lowerInput.includes('plan')) {
           const fragments = userInput.split(/and|,|then/i).map(s => s.trim()).filter(s => s.length > 3);
           const tasks = fragments.map((frag, index) => {
             return {
               title: frag.charAt(0).toUpperCase() + frag.slice(1),
               description: `Generated from: "${userInput}"`,
               priority: 'medium',
               dueDate: new Date().toISOString().split('T')[0],
               tags: ['ai-generated']
             };
           });
           resolve({
             type: 'tasks',
             message: "I've broken that down into actionable tasks for you:",
             tasks: tasks.length > 0 ? tasks : [{ title: "Example Task", description: "Default", priority: "medium", dueDate: new Date().toISOString().split('T')[0], tags: ['ai'] }]
           });
        } else {
          // General chat fallback
          resolve({
             type: 'chat',
             message: `**Mock AI Response:**\n\nI am currently running in Simulated Mode because no OpenAI API key is provided.\n\nYou said: *"${userInput}"*\n\nTo unlock my full conversational intelligence (writing emails, coding, answering general questions), please add your API Key in the **Settings**.`
          });
        }
      }, 1500);
    });
  }

  // Real OpenAI call
  try {
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Taskify AI, a premium productivity assistant. 
            Analyze the user's input. If they are asking you to create tasks, schedule things, or plan their day, return type "tasks" with an array of tasks. 
            If they are asking a general question, asking you to write something (like an email), brainstorming, or just chatting, return type "chat" and format your response in markdown.

            Return JSON in this exact structure:
            {
              "type": "chat" | "tasks",
              "message": "Your conversational response here (use Markdown!)",
              "tasks": [ // ONLY include this array if type is "tasks"
                {
                  "title": "Task title",
                  "description": "Brief context",
                  "priority": "low|medium|high|urgent",
                  "dueDate": "YYYY-MM-DD",
                  "tags": ["tag1"]
                }
              ]
            }
            Today's date is: ${new Date().toISOString().split('T')[0]}.`
          },
          ...formattedHistory,
          { role: 'user', content: userInput }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};
