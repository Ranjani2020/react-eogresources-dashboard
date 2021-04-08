import {
    Card,
    CardContent,
    Grid,
    Typography
} from '@material-ui/core';

const Item = (props) => (
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
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    </Grid>
);

export default Item;