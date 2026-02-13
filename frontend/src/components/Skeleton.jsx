import './Skeleton.css';

const Skeleton = ({ type }) => {
    const classes = `skeleton ${type}`;

    return (
        <div className={classes}>
            <div className="shimmer-wrapper">
                <div className="shimmer"></div>
            </div>
        </div>
    );
};

export default Skeleton;
