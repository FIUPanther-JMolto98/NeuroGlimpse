from transformers import GPT2Tokenizer

tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
if tokenizer.pad_token is None:  # Check if it's not already set
    tokenizer.pad_token = tokenizer.eos_token 

text = "A test sentence to encode"

encoding = tokenizer(text, padding='max_length', truncation=True, return_tensors='pt') 

# Flip to apply left-padding
encoding['input_ids'] = encoding['input_ids'].flip(dims=[1])  
encoding['attention_mask'] = encoding['attention_mask'].flip(dims=[1]) 

print(encoding['input_ids'])
print(encoding['attention_mask'])