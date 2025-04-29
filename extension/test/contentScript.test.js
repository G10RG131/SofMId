/**
 * @jest-environment jsdom
 */
import '../contentStyle.css';            // pull in the CSS
import '../contentScript.js';           // run the content script

// mock out chrome.runtime.sendMessage
global.chrome = {
  runtime: { sendMessage: jest.fn() }
};

describe('contentScript', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';        // reset DOM
    // re-inject script so addBtn is recreated
    // (we already imported once above; re-requiring clears listeners)
    jest.isolateModules(() => require('../contentScript.js'));
  });

  test('does not send a message when nothing is selected', () => {
    window.getSelection = () => ({ toString: () => '', rangeCount: 0 });
    document.dispatchEvent(new Event('mouseup'));
    expect(global.chrome.runtime.sendMessage).not.toHaveBeenCalled();
  });

  test('shows Add button when text selected but does not send until click', () => {
    window.getSelection = () => ({
      toString: () => 'hello world',
      rangeCount: 1,
      getRangeAt: () => ({ getBoundingClientRect: () => ({ bottom: 10, right: 50 }) })
    });

    document.dispatchEvent(new Event('mouseup'));

    const btn = document.getElementById('flashcard-add-btn');
    expect(btn.style.display).toBe('block');
    // still no message until click
    expect(global.chrome.runtime.sendMessage).not.toHaveBeenCalled();

    // now simulate user clicking “Add”
    btn.dispatchEvent(new MouseEvent('click'));

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: 'NEW_FLASHCARD',
      payload: expect.objectContaining({ text: 'hello world' })
    });
  });
});
