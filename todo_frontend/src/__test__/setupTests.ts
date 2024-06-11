// src/setupTests.ts
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.doMock();
});

afterEach(() => {
  fetchMock.resetMocks();
});
