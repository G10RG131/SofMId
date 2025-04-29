/**
 * @jest-environment jsdom
 */
test("no message when no selection", () => {
    const spy = jest.spyOn(chrome.runtime, "sendMessage");
    document.dispatchEvent(new Event("mouseup"));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  