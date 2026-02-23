import sys
import os
import random

def load_flashcards(filepath):
    if not os.path.exists(filepath):
        print(f"Error: Could not find {filepath}")
        return []
    
    flashcards = []
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    current_q = None
    current_a = None
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if line.startswith('Q: '):
            current_q = line[3:].strip()
        elif line.startswith('A: '):
            current_a = line[3:].strip()
            
            # Check for multi-line answers
            j = i + 1
            while j < len(lines) and not lines[j].strip().startswith('Q: ') and not lines[j].startswith('='):
                if lines[j].strip():
                    current_a += ' ' + lines[j].strip()
                j += 1
            i = j - 1
            
            if current_q and current_a:
                flashcards.append({'q': current_q, 'a': current_a})
                current_q = None
                current_a = None
        i += 1
        
    return flashcards

def main():
    filepath = 'flashcards.txt'
    flashcards = load_flashcards(filepath)
    
    if not flashcards:
        print("No flashcards loaded. Exiting.")
        return
        
    print(f"Loaded {len(flashcards)} flashcards from {filepath}.")
    print("Welcome to CLI Flashcards!")
    
    shuffle_input = input("Would you like to shuffle the cards? (y/n) [n]: ").strip().lower()
    if shuffle_input == 'y':
        random.shuffle(flashcards)
        print("Cards shuffled.")
        
    print("\nPress Return to flip the card, or type 'q' to quit.")
    print("-" * 50)
    
    for idx, card in enumerate(flashcards):
        print(f"\nCard {idx + 1} of {len(flashcards)}")
        print(f"Q: {card['q']}")
        
        user_input = input("\n[Press Return to flip, 'q' to quit] ")
        if user_input.lower() == 'q':
            print("Exiting flashcards. Great job studying!")
            break
            
        print(f"\n----------\nA: {card['a']}\n----------")
        
        if idx < len(flashcards) - 1:
            user_input = input("\n[Press Return for next card, 'q' to quit] ")
            if user_input.lower() == 'q':
                print("Exiting flashcards. Great job studying!")
                break
        else:
            print("\nThat was the last card! Great job!")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting flashcards...")
        sys.exit(0)
