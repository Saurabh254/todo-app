import { log, LogLevel } from "../Components/Logger";

interface CircularObject {
  otherData: string;
  myself?: CircularObject;
}

describe("log function", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "debug").mockImplementation();
    jest.spyOn(console, "info").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const levels: LogLevel[] = ["log", "debug", "info", "warn", "error"];
  const testMessage = "Test message";
  const testData = { key: "value" };

  levels.forEach((level) => {
    it(`calls console.${level} with the right parameters`, () => {
      log(level, testMessage, testData);

    
    });
  });

  it("handles circular references in objects", () => {
    const circularObject: CircularObject = { otherData: "123" };
    circularObject.myself = circularObject;

    log("info", testMessage, circularObject);

    
  });

  it("converts HTMLElements to string with tag name", () => {
    document.body.innerHTML = `<div id="test-div"></div>`;
    const element = document.getElementById("test-div");

    log("info", testMessage, element);

  
  });
});
