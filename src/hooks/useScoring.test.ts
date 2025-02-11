import { renderHook, act } from '@testing-library/react';
import { useScoring } from './useScoring';

describe('useScoring calculation', () => {
  const setupGame = () => {
    const { result } = renderHook(() => useScoring());
    act(() => {
      result.current.addPlayerScore('Player1');
    });
    return result;
  };

  describe('Basic frame scoring random', () => {
    it('calculates open frame correctly', () => {
      const result = setupGame();
      
      act(() => {
        for (let i = 0; i < 10; i++) {  
          result.current.updateScore('Player1', i, 0, '4');
          result.current.updateScore('Player1', i, 1, '3');
        }
      });

      expect(result.current.calculateScore('Player1')).toBe(70);
    });

    it('calculates zero score frame correctly', () => {
      const result = setupGame();
      
      act(() => {
        for (let i = 0; i < 10; i++) {  
          result.current.updateScore('Player1', i, 0, '0');
          result.current.updateScore('Player1', i, 1, '0');
        }
      });

      expect(result.current.calculateScore('Player1')).toBe(0);
    });
  });

  describe('Strike scoring', () => {
    it('calculates strike perfect game correctly', () => {
      const result = setupGame();
      
      act(() => {
        for (let i = 0; i < 9; i++) {
          result.current.updateScore('Player1', i, 0, 'X');
        }
        result.current.updateScore('Player1', 9, 0, 'X');
        result.current.updateScore('Player1', 9, 1, 'X');
        result.current.updateScore('Player1', 9, 2, 'X');
      });

      expect(result.current.calculateScore('Player1')).toBe(300);
    });

    it('calculates consecutive strikes correctly', () => {
      const result = setupGame();
      
      act(() => {
        result.current.updateScore('Player1', 0, 0, 'X');
        result.current.updateScore('Player1', 1, 0, 'X');
        result.current.updateScore('Player1', 2, 0, '3');
        result.current.updateScore('Player1', 2, 1, '4');
      });

      expect(result.current.calculateScore('Player1')).toBe(47); // (10 + 10 + 3) + (10 + 3 + 4) + 7
    });

    it('calculates strike in last frame correctly', () => {
      const result = setupGame();
      
      act(() => {
        for (let i = 0; i < 9; i++) {
          result.current.updateScore('Player1', i, 0, 'X');
        }
        result.current.updateScore('Player1', 9, 0, 'X');
        result.current.updateScore('Player1', 9, 1, '3');
        result.current.updateScore('Player1', 9, 2, '4');
      });

      expect(result.current.calculateScore('Player1')).toBe(280); // (30 * 8) + (10 + 10 + 3) + (10 + 3 + 4) 
    });
  });
    
  describe('Spare scoring', () => {
    it('calculates spare with following throw correctly', () => {
      const result = setupGame();
      
      act(() => {
        result.current.updateScore('Player1', 0, 0, '7');
        result.current.updateScore('Player1', 0, 1, '/');
        result.current.updateScore('Player1', 1, 0, '3');
      });

      expect(result.current.calculateScore('Player1')).toBe(16); // 10 + 3 + 3
    });

    it('calculates spare in last frame correctly', () => {
      const result = setupGame();
      
      act(() => {
        result.current.updateScore('Player1', 9, 0, '7');
        result.current.updateScore('Player1', 9, 1, '/');
        result.current.updateScore('Player1', 9, 2, '4');
      });

      expect(result.current.calculateScore('Player1')).toBe(14); // 10 + 4
    });
  });

  describe('Strike scoring', () => {
    it('calculates strike with two following throws correctly', () => {
      const result = setupGame();
      
      act(() => {
        result.current.updateScore('Player1', 0, 0, 'X');
        result.current.updateScore('Player1', 1, 0, '3');
        result.current.updateScore('Player1', 1, 1, '4');
      });

      expect(result.current.calculateScore('Player1')).toBe(24); // 10 + 7 + 7
    });

    it('calculates consecutive strikes correctly', () => {
      const result = setupGame();
      
      act(() => {
        result.current.updateScore('Player1', 0, 0, 'X');
        result.current.updateScore('Player1', 1, 0, 'X');
        result.current.updateScore('Player1', 2, 0, '3');
        result.current.updateScore('Player1', 2, 1, '4');
      });

      expect(result.current.calculateScore('Player1')).toBe(47); // (10 + 10 + 3) + (10 + 3 + 4) + 7
    });
  });

  describe('Perfect game and special cases', () => {
    it('calculates perfect game (all strikes) correctly', () => {
      const result = setupGame();
      
      act(() => {
        // First 9 frames
        for (let i = 0; i < 9; i++) {
          result.current.updateScore('Player1', i, 0, 'X');
        }
        // 10th frame with three strikes
        result.current.updateScore('Player1', 9, 0, 'X');
        result.current.updateScore('Player1', 9, 1, 'X');
        result.current.updateScore('Player1', 9, 2, 'X');
      });

      expect(result.current.calculateScore('Player1')).toBe(300);
    });

    it('calculates worst game (all zeros) correctly', () => {
      const result = setupGame();
      
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.updateScore('Player1', i, 0, '0');
          result.current.updateScore('Player1', i, 1, '0');
        }
      });

      expect(result.current.calculateScore('Player1')).toBe(0);
    });

    it('calculates all spares correctly', () => {
      const result = setupGame();
      
      act(() => {
        // First 9 frames
        for (let i = 0; i < 9; i++) {
          result.current.updateScore('Player1', i, 0, '5');
          result.current.updateScore('Player1', i, 1, '/');
        }
        // Last frame
        result.current.updateScore('Player1', 9, 0, '5');
        result.current.updateScore('Player1', 9, 1, '/');
        result.current.updateScore('Player1', 9, 2, '5');
      });

      expect(result.current.calculateScore('Player1')).toBe(150); // (10 + 5) * 9 + 15
    });
  });

  describe('Mixed scoring patterns', () => {
    it('calculates alternating strikes and spares correctly', () => {
      const result = setupGame();
      
      act(() => {
        // Strike
        result.current.updateScore('Player1', 0, 0, 'X');
        // Spare
        result.current.updateScore('Player1', 1, 0, '5');
        result.current.updateScore('Player1', 1, 1, '/');
        // Strike
        result.current.updateScore('Player1', 2, 0, 'X');
      });

      expect(result.current.calculateScore('Player1')).toBe(50); // (10 + 10) + (10 + 10) + 10
    });

    it('Calculates 10th frame with strike spare correctly', () => {
      const result = setupGame();
      // First 9 frames
      for (let i = 0; i < 9; i++) {
        result.current.updateScore('Player1', i, 0, 'X');
      }
 
      act(() => {
        result.current.updateScore('Player1', 9, 0, 'X');
        result.current.updateScore('Player1', 9, 1, '9');
        result.current.updateScore('Player1', 9, 2, '/');
      });

      expect(result.current.calculateScore('Player1')).toBe(289); // (8 * 30) + (10 + 10 + 9) + (10 + 9 + 1)
    });

    it('Calculates 10th frame with spare and strike correctly', () => {
      const result = setupGame();
      // First 9 frames
      for (let i = 0; i < 9; i++) {
        result.current.updateScore('Player1', i, 0, 'X');
      }

      act(() => {
        result.current.updateScore('Player1', 9, 0, '5');
        result.current.updateScore('Player1', 9, 1, '/');
        result.current.updateScore('Player1', 9, 2, 'X');
      });

      expect(result.current.calculateScore('Player1')).toBe(275); // (7 * 30) + (10 + 10 + 5) + (10 + 5 + 5) + (5 + 5 + 10)
    });
  })

  describe('Calculates regular game correctly', () => {
    it('case 1', () => {
      const result = setupGame();

      act(() => {
        result.current.updateScore('Player1', 0, 0, 'X');
        result.current.updateScore('Player1', 0, 1, '');
        result.current.updateScore('Player1', 1, 0, '9');
        result.current.updateScore('Player1', 1, 1, '/');
        result.current.updateScore('Player1', 2, 0, '8');
        result.current.updateScore('Player1', 2, 1, '1');
        result.current.updateScore('Player1', 3, 0, '7');
        result.current.updateScore('Player1', 3, 1, '/');
        result.current.updateScore('Player1', 4, 0, 'X');
        result.current.updateScore('Player1', 4, 1, '');
        result.current.updateScore('Player1', 5, 0, '6');
        result.current.updateScore('Player1', 5, 1, '/');
        result.current.updateScore('Player1', 6, 0, '5');
        result.current.updateScore('Player1', 6, 1, '3');
        result.current.updateScore('Player1', 7, 0, '9');
        result.current.updateScore('Player1', 7, 1, '/');
        result.current.updateScore('Player1', 8, 0, 'X');
        result.current.updateScore('Player1', 8, 1, '');
        result.current.updateScore('Player1', 9, 0, '7');
        result.current.updateScore('Player1', 9, 1, '/');
        result.current.updateScore('Player1', 9, 2, '8');
      });

      expect(result.current.calculateScore('Player1')).toBe(168);
    })

    it('case 2', () => {
      const result = setupGame();

      act(() => {
        result.current.updateScore('Player1', 0, 0, '7');
        result.current.updateScore('Player1', 0, 1, '/');
        result.current.updateScore('Player1', 1, 0, 'X');
        result.current.updateScore('Player1', 1, 1, '');
        result.current.updateScore('Player1', 2, 0, '9');
        result.current.updateScore('Player1', 2, 1, '/');
        result.current.updateScore('Player1', 3, 0, '8');
        result.current.updateScore('Player1', 3, 1, '1');
        result.current.updateScore('Player1', 4, 0, '7');
        result.current.updateScore('Player1', 4, 1, '/');
        result.current.updateScore('Player1', 5, 0, 'X');
        result.current.updateScore('Player1', 5, 1, '');
        result.current.updateScore('Player1', 6, 0, '6');
        result.current.updateScore('Player1', 6, 1, '/');
        result.current.updateScore('Player1', 7, 0, '5');
        result.current.updateScore('Player1', 7, 1, '3');
        result.current.updateScore('Player1', 8, 0, '9');
        result.current.updateScore('Player1', 8, 1, '/');
        result.current.updateScore('Player1', 9, 0, 'X');
        result.current.updateScore('Player1', 9, 1, '9');
        result.current.updateScore('Player1', 9, 2, '/');
      })

      expect(result.current.calculateScore('Player1')).toBe(170);
    })

    it('case 3', () => {
      const result = setupGame();

      act(() => {
        result.current.updateScore('Player1', 0, 0, '8');
        result.current.updateScore('Player1', 0, 1, '1');
        result.current.updateScore('Player1', 1, 0, '6');
        result.current.updateScore('Player1', 1, 1, '/');
        result.current.updateScore('Player1', 2, 0, 'X');
        result.current.updateScore('Player1', 2, 1, '');
        result.current.updateScore('Player1', 3, 0, '9');
        result.current.updateScore('Player1', 3, 1, '/');
        result.current.updateScore('Player1', 4, 0, '8');
        result.current.updateScore('Player1', 4, 1, '1');
        result.current.updateScore('Player1', 5, 0, '7');
        result.current.updateScore('Player1', 5, 1, '/');
        result.current.updateScore('Player1', 6, 0, 'X');
        result.current.updateScore('Player1', 6, 1, '');
        result.current.updateScore('Player1', 7, 0, '8');
        result.current.updateScore('Player1', 7, 1, '1');
        result.current.updateScore('Player1', 8, 0, '7');
        result.current.updateScore('Player1', 8, 1, '/');
        result.current.updateScore('Player1', 9, 0, '9');
        result.current.updateScore('Player1', 9, 1, '/');
        result.current.updateScore('Player1', 9, 2, '7');
      })

      expect(result.current.calculateScore('Player1')).toBe(160);
    })

    it('case 4', () => {
      const result = setupGame();

      act(() => {
        result.current.updateScore('Player1', 0, 0, '0');
        result.current.updateScore('Player1', 0, 1, '0');
        result.current.updateScore('Player1', 1, 0, '5');
        result.current.updateScore('Player1', 1, 1, '3');
        result.current.updateScore('Player1', 2, 0, '7');
        result.current.updateScore('Player1', 2, 1, '/');
        result.current.updateScore('Player1', 3, 0, 'X');
        result.current.updateScore('Player1', 3, 1, '');
        result.current.updateScore('Player1', 4, 0, '9');
        result.current.updateScore('Player1', 4, 1, '/');
        result.current.updateScore('Player1', 5, 0, '8');
        result.current.updateScore('Player1', 5, 1, '1');
        result.current.updateScore('Player1', 6, 0, '7');
        result.current.updateScore('Player1', 6, 1, '/');
        result.current.updateScore('Player1', 7, 0, '6');
        result.current.updateScore('Player1', 7, 1, '/');
        result.current.updateScore('Player1', 8, 0, '5');
        result.current.updateScore('Player1', 8, 1, '3');
        result.current.updateScore('Player1', 9, 0, 'X');
        result.current.updateScore('Player1', 9, 1, '8');
        result.current.updateScore('Player1', 9, 2, '1');
      })

      expect(result.current.calculateScore('Player1')).toBe(133);
    })
  });
}); 