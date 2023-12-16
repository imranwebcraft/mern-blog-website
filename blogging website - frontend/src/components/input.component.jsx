import { useState } from 'react';

const InputBox = ({ name, type, id, placeholder, value, icon }) => {
	const [passwordVisible, setPasswordVisible] = useState(false);
	console.log(passwordVisible);
	return (
		<div className="relative w-[100%] mb-4">
			<input
				name={name}
				type={
					type == 'password' ? (passwordVisible ? 'text' : 'password') : type
				}
				placeholder={placeholder}
				defaultValue={value}
				id={id}
				className="input-box"
			/>
			<i className={'fi ' + icon + ' input-icon'}></i>
			{type == 'password' ? (
				<i
					onClick={() => setPasswordVisible((currentValue) => !currentValue)}
					className={
						'fi ' +
						(passwordVisible ? 'fi-rr-eye-crossed' : 'fi-rr-eye') +
						' input-icon left-[auto] right-4 cursor-pointer'
					}
				></i>
			) : (
				''
			)}
		</div>
	);
};

export default InputBox;
