import {beforeAll, vi, describe, it, expect, afterAll} from "vitest";
import generateHtmlFiles from "./generateHtml.js";
import fs from "fs";

const htmlPath = 'public/html/md.html'
const mdFilePath = 'md.md'
let markdown;
let expectedHtml;
vi.mock('fs')
beforeAll(() => {
  fs.readFileSync.mockImplementation((filePath) => {
    if (filePath === 'md.md') {
      return markdown;
    } else {
      return JSON.stringify([`${mdFilePath}`])
    }
  });
  fs.existsSync.mockImplementation(() => {
  
  });
  fs.writeFileSync.mockImplementation(() => {
  });
})

afterAll(() => {
  vi.clearAllMocks();
});

describe("html 생성 요청 시", () => {
  it("마크다운이 HTML로 변환된다", async () => {
    // given
    markdown = '# H1';
    expectedHtml = '<h1>H1</h1>';

    // when
    await generateHtmlFiles()

    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      htmlPath,
      expectedHtml,
      'utf-8'
    );
  });
  
  it("줄바꿈이 처리된다", async () => {
    // given
    markdown = '줄바꿈이\n처리된다';
    expectedHtml = `<p>줄바꿈이<br>
처리된다</p>`;
    
    // when
    await generateHtmlFiles()
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      htmlPath,
      expectedHtml,
      'utf-8'
    );
  });
  
  it("표가 파싱된다.", async () => {
    // given
    markdown = '| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |\n' +
      '| :---- | :----: | -----: |\n' +
      '| 내용    |   내용   |     내용 |';
    expectedHtml = `<table>
<thead>
<tr>
<th align="left">왼쪽 정렬</th>
<th align="center">가운데 정렬</th>
<th align="right">오른쪽 정렬</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">내용</td>
<td align="center">내용</td>
<td align="right">내용</td>
</tr>
</tbody>
</table>`;
    
    // when
    await generateHtmlFiles()
    
    // then
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      htmlPath,
      expectedHtml,
      'utf-8'
    );
  });
});
