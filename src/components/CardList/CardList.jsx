import React, { useState, useEffect, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Input, Space, List, Avatar, Button, Spin, Alert, Pagination, Rate } from 'antd';
import { debounce } from 'lodash';
import { format } from 'date-fns';

import '../CardList/CardList.css';
// import PropTypes from 'prop-types';
import { Context } from '../../App';
import Service from '../Api';

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  } else {
    const truncatedText = text.substr(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    return truncatedText.substr(0, lastSpaceIndex) + '...';
  }
};

const CardList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false); // Добавляем состояние для индикатора загрузки
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);
  const [inputValue, setInputValue] = useState('');
  // const [guestSessionId] = useState('');
  const ganresList = useContext(Context);
  const isMobile = useMediaQuery({ maxWidth: 420 });
  // const apiKey = '7e14147cbafc9f8e4f095ea26ebf8692';
  const service = new Service();
  console.log(service);

  useEffect(() => {
    // const searchMovies = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=1&per_page=6`);
    //     setLoading(false);
    //     if (response.ok) {
    //       const data = await response.json();
    //       setMovies(data.results);
    //       console.log(data.results);
    //       setTotal(data.total_results);
    //       console.log(data.total_results);
    //     } else {
    //       console.error('Failed to fetch movies');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching movies:', error);
    //   }
    // };
    // searchMovies();
  }, []);

  const handleSearch = debounce(async (value) => {
    const debouncedSearch = await service.searchMovies({ value });
    setMovies(debouncedSearch.results);
    setTotal(debouncedSearch.total_results);
    setInputValue(value);
    console.log(value);
  }, 2000);

  const onChangePage = async (page) => {
    setLoading(true);
    const moviesArr = await service.searchMovies({ value: inputValue, page });
    setMovies(moviesArr.results);
    setTotal(moviesArr.total_results);
    setLoading(false);
  };

  const onChangeRate = async (movieId, valueRate) => {
    try {
      setLoading(true);
      await service.rateMovie({ movieId, valueRate });
      setLoading(false);
    } catch (error) {
      setError('Error fetching movies');
    }
  };
  return (
    <div className="wrapper">
      {isMobile ? (
        <>
          {/* MOBILE */}
          <Space direction="vertical" className="container--full-width" size={'large'}>
            <Input
              placeholder="Введите поисковый запрос"
              size="large"
              className="container__input--full-width"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Space>
          {/* Индикатор загрузки */}
          {loading && <Spin />}
          {/* Обработка ошибок */}
          {error && <Alert message={error} type="error" />}
          <List
            className="movies-list"
            grid={{ gutter: 10, column: 1 }}
            dataSource={movies}
            locale={{ emptyText: 'нет данных no results' }}
            loading={loading}
            renderItem={(movie) => {
              return (
                <List.Item
                  style={{ width: 380, height: 245, position: 'relative', paddingRight: 25 }}
                  className="list-item"
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      padding: '5px',
                      border: `2px solid ${movie.vote_average >= 7 ? '#66E900' : movie.vote_average >= 5 ? '#E9D100' : movie.vote_average >= 3 ? '#E97E00' : '#E90000'}`,
                    }}
                    className="rating--circle"
                  >
                    {movie.vote_average.toFixed(1)}
                  </div>

                  <List.Item.Meta
                    avatar={
                      <Avatar
                        className="movie-poster"
                        shape="square"
                        style={{ width: 60, height: 91 }}
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      />
                    }
                    title={
                      <>
                        <p className="movie-title">{movie.title}</p>
                        <p>
                          {movie.release_date
                            ? format(movie.release_date, 'MMMM dd, yyyy')
                            : 'The release date is not specified.'}{' '}
                        </p>
                        <div style={{ marginBottom: 10, maxHeight: 25, overflow: 'hidden' }}>
                          {movie.genre_ids.map((genre) => (
                            <Button key={genre} size="small" style={{ marginRight: 5, fontSize: 12 }} disabled>
                              {ganresList.find((genreName) => genreName.id === genre).name}
                            </Button>
                          ))}
                        </div>
                      </>
                    }
                    description={
                      <>
                        <p className="description">{truncateText(movie.overview, 200)}</p>
                        <p>
                          <Rate
                            count={10}
                            allowHalf={true}
                            onChange={(rate) => onChangeRate(movie.id, rate)}
                            className="rating-stars"
                          />
                        </p>
                      </>
                    }
                  />
                </List.Item>
              );
            }}
          />

          <Pagination
            total={total}
            pageSize={20}
            onChange={onChangePage}
            showSizeChanger={false}
            className="pagination"
          />
        </>
      ) : (
        // DESKTOP layout
        <>
          <Space direction="vertical" className="container--full-width" size={'large'}>
            <Input
              placeholder="Введите поисковый запрос"
              size="large"
              className="container__input--full-width"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Space>
          {/* Индикатор загрузки */}
          {loading && <Spin />}
          {/* Обработка ошибок */}
          {error && <Alert message={error} type="error" />}
          <List
            className="movies-list"
            grid={{ gutter: 40, column: 2 }}
            itemLayout="horizontal"
            dataSource={movies}
            locale={{ emptyText: 'нет данных no results' }}
            loading={loading}
            renderItem={(movie) => {
              return (
                <List.Item
                  style={{ width: 451, height: 279, position: 'relative', paddingRight: 25 }}
                  className="list-item"
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      padding: '5px',
                      border: `2px solid ${movie.vote_average >= 7 ? '#66E900' : movie.vote_average >= 5 ? '#E9D100' : movie.vote_average >= 3 ? '#E97E00' : '#E90000'}`,
                    }}
                    className="rating--circle"
                  >
                    {movie.vote_average.toFixed(1)}
                  </div>

                  <List.Item.Meta
                    avatar={
                      <Avatar
                        className="movie-poster"
                        shape="square"
                        style={{ width: 183, height: 281 }}
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      />
                    }
                    title={
                      <>
                        <p className="movie-title">{movie.title}</p>
                        <p>
                          {movie.release_date
                            ? format(movie.release_date, 'MMMM dd, yyyy')
                            : 'The release date is not specified.'}{' '}
                        </p>
                        <div style={{ marginBottom: 10, maxHeight: 25, overflow: 'hidden' }}>
                          {movie.genre_ids.map((genre) => (
                            <Button key={genre} size="small" style={{ marginRight: 5, fontSize: 12 }} disabled>
                              {ganresList.find((genreName) => genreName.id === genre).name}
                            </Button>
                          ))}
                        </div>
                      </>
                    }
                    description={
                      <>
                        <p className="description">{truncateText(movie.overview, 200)}</p>
                        <p>
                          <Rate
                            count={10}
                            character={<span style={{ fontSize: '20px' }}>★</span>}
                            allowHalf={true}
                            onChange={(rate) => onChangeRate(movie.id, rate)}
                            className="rating-stars"
                          />
                        </p>
                      </>
                    }
                  />
                </List.Item>
              );
            }}
          />

          <Pagination
            total={total}
            pageSize={20}
            onChange={onChangePage}
            showSizeChanger={false}
            className="pagination"
          />
        </>
      )}
    </div>
  );
};

export default CardList;
