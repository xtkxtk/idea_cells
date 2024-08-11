import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./logo.jpg";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable.
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { maxOutputTokens: 200, temperature: 2 },
  systemInstruction: `You are an advanced AI assistant specializing in generating and organizing creative ideas. Your task is to split broad concepts into detailed ideas and merge multiple ideas into a single, innovative concept. Follow these guidelines:
1. **Language:** All responses must be in Korean.
2. **Format:** 
   - For splitting ideas: List exactly 3 idea names on new lines. If there are fewer than 6 viable ideas, list all available ideas.
   - For merging ideas: Make a new creative idea based on selected ideas. The new idea should be described in a single sentence and be written in Korean.
3. **Tone:** Maintain a professional and creative tone.
4. **Details:** Ensure each idea is clear, practical, and actionable.
5. **Creativity:** Emphasize originality in merged ideas and make sure all combined ideas are coherent and innovative.
6. **User Instructions:** Follow the user's input closely, and ensure the response adheres to the specified format.`,
});

function App() {
  // 초기 셀 상태 설정
  const [cells, setCells] = useState([
    {
      id: 1,
      text: "주제를 입력해주세요",
      position: { column: 0, row: 0 },
      children: [],
      childrenCount: 1,
      parentId: null,
      color: { r: 0, g: 123, b: 255 }, // 초기 색상 설정
    },
  ]);

  // 다중 선택된 셀들의 ID를 저장하는 상태
  const [selectedCells, setSelectedCells] = useState([]);

  // 병합 버튼의 표시를 위한 상태
  const [mergeButtonVisible, setMergeButtonVisible] = useState(false);

  // 셀 텍스트 변경 처리
  const handleTextChange = (e, id) => {
    const newText = e.target.innerText;
    setCells((cells) =>
      cells.map((cell) => (cell.id === id ? { ...cell, text: newText } : cell))
    );
  };

  // 셀 선택 처리
  const handleCellClick = (e, id) => {
    if (e.ctrlKey) {
      setSelectedCells((prev) => {
        if (prev.includes(id)) {
          return prev.filter((cellId) => cellId !== id);
        } else {
          return [...prev, id];
        }
      });
    } else {
      setSelectedCells([id]);
    }
  };

  // 새로운 셀의 위치 찾기
  const findAvailablePosition = (parentCell, index) => {
    // 부모 셀의 위치를 기준으로 자식 셀의 위치를 설정
    const column = parentCell.position.column + 1; // 오른쪽으로 한 칸
    const row = parentCell.position.row + index; // 부모 셀의 위치에서 한 칸 위로 조정

    return { column, row };
  };

  // 색상 생성 함수
  const generateChildColor = (parentColor) => {
    const randomOffset = () => Math.floor(Math.random() * 101) - 50; // -25에서 25 사이의 무작위 값
    return {
      r: Math.min(Math.max(parentColor.r + randomOffset(), 0), 255),
      g: Math.min(Math.max(parentColor.g + randomOffset(), 0), 255),
      b: Math.min(Math.max(parentColor.b + randomOffset(), 0), 255),
    };
  };

  // 화면 리렌더링 후 위치 및 레이아웃 재조정
  const updatePositions = (updatedCells) => {
    const adjustCellPositions = (cellId, startRow) => {
      const cell = updatedCells.find((c) => c.id === cellId);
      if (!cell) return startRow;

      cell.position.row = startRow;
      let nextRow = startRow;

      // 자식 셀들의 위치를 조정
      cell.children.forEach((childId) => {
        nextRow = adjustCellPositions(childId, nextRow + 1);
      });

      return nextRow;
    };

    // 최상위 셀들에 대해 위치를 조정
    updatedCells.forEach((cell) => {
      if (!cell.parentId) {
        adjustCellPositions(cell.id, cell.position.row);
      }
    });

    return updatedCells;
  };

  // 자식 노드 수를 업데이트하는 함수
  const updateChildrenCount = (cells) => {
    const updateCount = (cellId) => {
      const cell = cells.find((c) => c.id === cellId);
      if (!cell) return 0;

      if (cell.children.length === 0) {
        cell.childrenCount = 1; // 리프 노드는 자기 자신만 카운트
        return 1;
      }

      let count = 0;
      cell.children.forEach((childId) => {
        count += updateCount(childId);
      });

      // 자식 노드 수가 변경된 경우에만 업데이트
      if (cell.childrenCount !== count) {
        cell.childrenCount = count;
      }
      return count;
    };

    cells.forEach((cell) => {
      if (!cell.parentId) {
        updateCount(cell.id);
      }
    });

    return cells;
  };

  // 여러 셀을 분리하는 함수
  const separating = async (id, namelist) => {
    setCells((cells) => {
      const cell = cells.find((cell) => cell.id === id);
      if (!cell) return cells;

      const updatedCells = [...cells];
      const newCells = namelist.map((name, index) => {
        const newPosition = findAvailablePosition(cell, index);
        const newColor = generateChildColor(cell.color);
        const newCell = {
          id: Math.max(...updatedCells.map((c) => c.id)) + 1,
          text: name,
          position: newPosition,
          children: [],
          childrenCount: 1, // 새 셀은 자식 개수가 1로 시작
          parentId: cell.id,
          color: newColor,
        };
        updatedCells.push(newCell);
        cell.children.push(newCell.id); // 부모-자식 관계 설정
        return newCell;
      });

      // 셀 위치를 업데이트
      const updatedCellsWithPositions = updatePositions(updatedCells);
      // 자식 노드 수를 업데이트
      const updatedCellsWithCounts = updateChildrenCount(updatedCellsWithPositions);
      return updatedCellsWithCounts;
    });
  };

  // 특정 셀을 분리하는 함수
  const separate = async (id) => {
    const cell = cells.find((cell) => cell.id === id);
    if (!cell) return;

    const prompt = `Create List exactly 3 idea names on new lines based on the given sentence. Each idea should be listed on a new line. Write in korean. Input text: ${cell.text}`;

    try {
      const result = await model.generateContent(prompt); // 단순 문자열로 요청
      const text = result.response.text().trim(); // trim()으로 불필요한 공백 제거
      console.log(text);
      const namelist = text.split("\n").filter((line) => line.trim() !== ""); // 빈 줄 제거
      await separating(id, namelist);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  // 병합 버튼 클릭시 실행되는 함수
  const merge = async () => {
    if (selectedCells.length < 2) return;

    const selectedTexts = selectedCells
      .map((id) => {
        const cell = cells.find((cell) => cell.id === id);
        return cell ? cell.text : "";
      })
      .join("\n");

    const prompt = `Create exactly one idea name based on the given ideas. The name should be described in a single sentence and be written in Korean. Input ideas: ${selectedTexts}`;

    try {
      const result = await model.generateContent(prompt); // 단순 문자열로 요청
      const mergedText = result.response.text().trim(); // trim()으로 불필요한 공백 제거

      const firstSelectedCell = cells.find(
        (cell) => cell.id === selectedCells[0]
      );

      setCells((cells) => {
        const remainingCells = cells.filter(
          (cell) => !selectedCells.includes(cell.id)
        );
        const newCell = {
          id: Math.max(...cells.map((c) => c.id)) + 1,
          text: mergedText,
          position: { ...firstSelectedCell.position },
          children: [],
          childrenCount: 1,
          parentId: firstSelectedCell.parentId,
          color: firstSelectedCell.color, // 병합된 셀의 색상 설정
        };

        // 부모-자식 관계 업데이트
        const parentCell = remainingCells.find(
          (cell) => cell.id === firstSelectedCell.parentId
        );
        if (parentCell) {
          parentCell.children.push(newCell.id);
          parentCell.children = parentCell.children.filter(
            (id) => !selectedCells.includes(id)
          );
        }

        const updatedCells = [...remainingCells, newCell];

        // 셀 위치를 업데이트
        const cellsWithUpdatedPositions = updatePositions(updatedCells);
        // 자식 노드 수를 업데이트
        const cellsWithUpdatedCounts = updateChildrenCount(
          cellsWithUpdatedPositions
        );

        return cellsWithUpdatedCounts;
      });

      setSelectedCells([]); // 선택된 셀 초기화
      setMergeButtonVisible(false); // 병합 버튼 숨김
    } catch (error) {
      console.error("Error generating merged content:", error);
    }
  };

  useEffect(() => {
    setMergeButtonVisible(selectedCells.length >= 2);
  }, [selectedCells]);

  return (
    <div className="App" style={{ height: '100vh', overflow: 'hidden' }}>
      <header className="header" style={{ position: 'relative', zIndex: 1 }}>
        <div className="head">
          <img src={logo} alt="logo" width={205} height={61} />
        </div>
      </header>
      <div className="body" style={{ position: 'relative', zIndex: 0, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gridAutoRows: 'minmax(100px, auto)', gap: '10px' }}>
        {cells.map(cell => (
          <div
            key={cell.id}
            style={{
              gridColumn: cell.position.column + 1,
              gridRow: cell.position.row + 1,
            }}
          >
            <div
              className={`cell ${selectedCells.includes(cell.id) ? 'selected' : ''}`}
              contentEditable
              onClick={(e) => handleCellClick(e, cell.id)}
              onDoubleClick={() => separate(cell.id)}
              onBlur={(e) => handleTextChange(e, cell.id)}
              suppressContentEditableWarning={true}
              style={{
                border: selectedCells.includes(cell.id) ? '2px solid black' : 'none',
                backgroundColor: `rgb(${cell.color.r}, ${cell.color.g}, ${cell.color.b})`, // 셀의 배경색 설정
              }}
            >
              {cell.text}
            </div>
          </div>
        ))}
        {mergeButtonVisible && (
          <button
            className="mergeButton"
            style={{
              position: 'absolute',
              left: cells.find(cell => cell.id === selectedCells[0]).position.column * 150 + 160,
              top: cells.find(cell => cell.id === selectedCells[0]).position.row * 100,
            }}
            onClick={merge}
          >
            Merge
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
