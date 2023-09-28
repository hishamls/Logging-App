import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const Login = () => {
  const [isValidForm, setIsValidForm] = useState(false);

  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passWInputRef = useRef();

  const mailReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: action.val.includes("@") };
    }
    if (action.type === "USER_BLUR") {
      return { value: state.value, isValid: state.value.includes("@") };
    }
    return { value: "", isValid: false };
  };

  const passReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: action.val.trim().length > 6 };
    }
    if (action.type === "USER_BLUR") {
      return { value: state.value, isValid: state.value.trim().length > 6 };
    }
    return { value: "", isValid: false };
  };

  const init = { value: "", isValid: null };

  const [emailState, emailDispatch] = useReducer(mailReducer, init);
  const [passState, passDispatch] = useReducer(passReducer, init);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passIsValid } = passState;

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Check form validity, any else!");
      setIsValidForm(emailIsValid && passIsValid);
    }, 500);

    return () => {
      console.log("Clean Up! You're writing!");
      clearTimeout(timer);
    };
  }, [emailIsValid, passIsValid]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isValidForm) {
      authCtx.onLogin(emailState.value, passState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passWInputRef.current.focus();
    }
  };

  const emailChangeHandler = (e) => {
    emailDispatch({ type: "USER_INPUT", val: e.target.value });
  };

  const emailBlurHandler = () => {
    emailDispatch({ type: "USER_BLUR" });
  };

  const passwordChangeHandler = (e) => {
    passDispatch({ type: "USER_INPUT", val: e.target.value });
  };

  const passwordBlurHandler = () => {
    passDispatch({ type: "USER_BLUR" });
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          type="email"
          id="email"
          ref={emailInputRef}
          label="E Mail"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />

        <Input
          type="password"
          id="password"
          ref={passWInputRef}
          label="Password"
          isValid={passIsValid}
          value={passState.value}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!isValidForm}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
