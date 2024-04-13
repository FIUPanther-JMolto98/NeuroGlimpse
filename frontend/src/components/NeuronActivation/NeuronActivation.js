// import React, { useRef, useEffect } from 'react';
// import { head_view } from 'bertviz';
// import { BertTokenizer, BertModel } from 'transformers';

// const NeuronActivation = ({ onSizeChange }) => {
//   const d3Container = useRef(null);

//   useEffect(() => {
//     const loadModel = async () => {
//       const model_version = 'bert-base-uncased';
//       const model = await BertModel.from_pretrained(model_version, output_attentions=True);
//       const tokenizer = await BertTokenizer.from_pretrained(model_version);

//       const sentence_a = "The cat sat on the mat";
//       const sentence_b = "The cat lay on the rug";
//       const inputs = tokenizer.encode_plus(sentence_a, sentence_b, return_tensors='pt');
//       const input_ids = inputs['input_ids'];
//       const token_type_ids = inputs['token_type_ids'];

//       const attention = model(input_ids, token_type_ids=token_type_ids)[-1];
//       const sentence_b_start = token_type_ids[0].tolist().indexOf(1);
//       const input_id_list = input_ids[0].tolist(); // Batch index 0
//       const tokens = tokenizer.convert_ids_to_tokens(input_id_list);

//       if (d3Container.current) {
//         head_view(attention, tokens, sentence_b_start, d3Container.current);

//         // Notify the parent component of the widget's size
//         const widgetWidth = d3Container.current.offsetWidth;
//         const widgetHeight = d3Container.current.offsetHeight;
//         onSizeChange(widgetWidth, widgetHeight);
//       }
//     };

//     loadModel();
//   }, [onSizeChange]);

//   return <div ref={d3Container} style={{ width: '100%', height: '400px' }} />;
// };

// export default NeuronActivation;