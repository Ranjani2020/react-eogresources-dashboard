import {
    Card,
    CardContent,
    Grid,
    Typography,
    Button
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    button: {
        marginTop: "1rem"
    }
});

const Item = (props) => {
    const classes = useStyles();

    return (
        <Grid
            item
            lg={2}
            sm={6}
            xl={2}
            xs={12}
        >
            <Card
                sx={{ height: '100%' }}
            >
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                        sx={{ justifyContent: 'space-between' }}
                    >
                        <Grid item>
                            <Typography
                                color="textSecondary"
                                gutterBottom
                                variant="h6"
                            >
                                {props.textPrimary}
                            </Typography>
                            <Typography
                                color="textPrimary"
                                variant="h5"
                            >
                                {props.textSecondary}
                            </Typography>

                            <Button
                                color="primary"
                                size="small"
                                variant="contained"
                                className={classes.button}
                                onClick={() => props.onClick && props.onClick()}
                            >
                                Check Report
                            </Button>
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>
        </Grid>
    )
}

export default Item;