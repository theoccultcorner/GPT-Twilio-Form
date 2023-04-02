import Head from "next/head";
import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Grid, TextField, Button } from '@material-ui/core';
 

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
      maxWidth: '25ch',
    },
    '& .MuiButton-root': {
      margin: theme.spacing(1),
    },
    '& .MuiButton-contained': {
      backgroundColor: 'black',
      color: 'white',
    },
    padding: theme.spacing(2),
    boxSizing: 'border-box', // include padding in width/height
  },
  card: {
    maxWidth: 500,
    width: '100%',
    margin: 'auto',
  },
}));

export default function Home() {
  const [inputName, setInputName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState();

  const classes = useStyles();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputName,
          phone: inputPhone,
          email: inputEmail,
          text: inputText
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setInputName("");
      setInputPhone("");
      setInputEmail("");
      setInputText("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>AI</title>
        <link rel="icon" href=" " />
      </Head>

      <main>
        <Grid container justifyContent="center">
          <Card className={classes.card}>
            <CardContent>
              <form onSubmit={onSubmit} className={classes.root}>
                <TextField
                  required
                  label="Name"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                />
                <TextField
                  required
                  label="Phone"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                />
                <TextField
                  required
                  label="Email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
                <TextField
                  required
                  label="Text"
                  multiline
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Button type="submit" variant="contained">Submit</Button>
              </form>
              <div>{result}</div>
            </CardContent>
          </Card>
        </Grid>
      </main>
    </div>
  );
}
